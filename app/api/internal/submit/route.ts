import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms, submissions, webhooks as webhooksTable } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { triggerWebhooks } from "@/lib/webhooks/delivery";

export async function POST(req: NextRequest) {
    // 1. Secret Protection
    const secret = req.headers.get("x-vibe-secret");
    const internalSecret = process.env.INTERNAL_API_SECRET || "fallback-secret";

    if (secret !== internalSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { formId, payload, metadata } = await req.json();

        // 2. Fetch Form
        const [form] = await db
            .select()
            .from(forms)
            .where(eq(forms.id, formId))
            .limit(1);

        if (!form) {
            return NextResponse.json({ error: "Form not found" }, { status: 404 });
        }

        // 3. Status Handling (CRITICAL: No persistence if paused or revoked)
        if (form.status === "revoked") {
            return NextResponse.json({
                error: "This form has been revoked and is no longer accepting submissions.",
                code: "FORM_REVOKED"
            }, { status: 403 });
        }

        if (form.status === "paused") {
            return NextResponse.json({
                error: "This form is currently paused and not accepting submissions."
            }, { status: 403 });
        }

        // 4. Payload Intelligence (Special Fields)
        const specialFields: Record<string, any> = {};
        const sanitizedPayload: Record<string, any> = {};

        // Extract underscore fields
        Object.keys(payload).forEach(key => {
            if (key.startsWith("_")) {
                specialFields[key] = payload[key];
            } else {
                sanitizedPayload[key] = payload[key];
            }
        });

        // 5. Determine Redirect
        // Dashboard settings take priority to allow easy configuration without code changes.
        const settings = (form.settings || {}) as any;
        const configUrl = settings.success_url || settings.successUrl;
        const redirectUrl = (configUrl && configUrl.trim() !== "") ? configUrl : (specialFields._next || null);

        // 6. Save Submission (Persistence)
        const enrichedMetadata = {
            ...metadata,
            test_mode: form.status === "test_mode",
            subject_override: specialFields._subject || null,
            reply_to: specialFields._replyto || sanitizedPayload.email || sanitizedPayload.Email || null,
        };

        const [newSubmission] = await db.insert(submissions).values({
            formId: form.id,
            payload: sanitizedPayload,
            metadata: enrichedMetadata,
            status: "unread", // Default to unread for new submissions
        }).returning();

        // 7. Trigger Webhooks ⚡ (Non-blocking)
        try {
            const activeWebhooks = await db
                .select({ url: webhooksTable.url, secret: webhooksTable.secret })
                .from(webhooksTable)
                .where(and(
                    eq(webhooksTable.formId, form.id),
                    eq(webhooksTable.status, "active")
                ));

            if (activeWebhooks.length > 0) {
                // We fire and forget to ensure the response to the user is immediate
                triggerWebhooks(activeWebhooks, {
                    event: "submission.created",
                    formId: form.id,
                    submission: {
                        id: newSubmission.id,
                        payload: sanitizedPayload,
                        metadata: enrichedMetadata,
                        createdAt: newSubmission.createdAt.toISOString(),
                    }
                }).catch(err => console.error("[Webhook Trigger Error]:", err));
            }
        } catch (webhookErr) {
            // Log but don't fail the submission
            console.error("[Webhook Discovery Error]:", webhookErr);
        }

        // 8. Build Response
        return NextResponse.json({
            success: true,
            redirectUrl: redirectUrl
        });

    } catch (error) {
        console.error("Internal submission error:", error);
        return NextResponse.json(
            { error: "Failed to process submission" },
            { status: 500 }
        );
    }
}
