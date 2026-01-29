import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms, submissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

        console.log(`[Internal] id=${formId} dashboard=${configUrl} underscoreNext=${specialFields._next} final=${redirectUrl}`);

        // 6. Save Submission (Persistence)
        const enrichedMetadata = {
            ...metadata,
            test_mode: form.status === "test_mode",
            subject_override: specialFields._subject || null,
            reply_to: specialFields._replyto || sanitizedPayload.email || sanitizedPayload.Email || null,
        };

        await db.insert(submissions).values({
            formId: form.id,
            payload: sanitizedPayload,
            metadata: enrichedMetadata,
            status: "unread", // Default to unread for new submissions
        });

        // 7. Build Response
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
