import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissions, forms } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id: submissionId } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch submission joined with form to verify ownership
        const [result] = await db
            .select({
                submission: submissions,
                formOwnerId: forms.ownerId,
            })
            .from(submissions)
            .innerJoin(forms, eq(submissions.formId, forms.id))
            .where(eq(submissions.id, submissionId))
            .limit(1);

        if (!result) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        // Permission check: only owner can read their form's submissions
        if (result.formOwnerId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(result.submission);
    } catch (error) {
        console.error("Fetch submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id: submissionId } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        // Verify ownership and update status
        const [result] = await db
            .select({ ownerId: forms.ownerId })
            .from(submissions)
            .innerJoin(forms, eq(submissions.formId, forms.id))
            .where(eq(submissions.id, submissionId))
            .limit(1);

        if (!result) {
            return NextResponse.json({ error: "Submission not found" }, { status: 404 });
        }

        if (result.ownerId !== session.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const [updated] = await db
            .update(submissions)
            .set({ status, updatedAt: new Date() })
            .where(eq(submissions.id, submissionId))
            .returning();

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Update submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
