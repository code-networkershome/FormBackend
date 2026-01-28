import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { forms, submissions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    // 1. Secret Protection (Verified in Proxy/Middleware but double check here)
    const secret = req.headers.get("x-vibe-secret");
    if (secret !== process.env.INTERNAL_API_SECRET) {
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

        if (form.status === "paused") {
            return NextResponse.json({ error: "Form is currently paused" }, { status: 403 });
        }

        // 3. Determine Submission Status
        // If form is in test_mode, we might want to flag the submission specially
        const submissionStatus = form.status === "test_mode" ? "unread" : "unread";
        // Metadata can also store if it was test mode
        const enrichedMetadata = {
            ...metadata,
            test_mode: form.status === "test_mode",
        };

        // 4. Save Submission
        await db.insert(submissions).values({
            formId: form.id,
            payload,
            metadata: enrichedMetadata,
            status: submissionStatus,
        });

        // 5. Build Response
        const successUrl = form.settings?.success_url;

        return NextResponse.json({
            success: true,
            redirectUrl: successUrl || null
        });

    } catch (error) {
        console.error("Internal submission error:", error);
        return NextResponse.json(
            { error: "Failed to process submission" },
            { status: 500 }
        );
    }
}
