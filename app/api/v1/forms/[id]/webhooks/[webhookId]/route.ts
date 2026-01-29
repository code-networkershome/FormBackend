import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { webhooks, forms } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string; webhookId: string }> }
) {
    const session = await auth();
    const { id: formId, webhookId } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const result = await db
        .delete(webhooks)
        .where(and(
            eq(webhooks.id, webhookId),
            eq(webhooks.formId, formId),
            // Ensure ownerId of the form matches the session user
            inArray(
                webhooks.formId,
                db.select({ id: forms.id })
                    .from(forms)
                    .where(eq(forms.ownerId, userId))
            )
        ))
        .returning();

    // Safety check: verify ownership of the formId before truly concluding success
    // Drizzle delete with where and form join is better.

    if (result.length === 0) {
        return NextResponse.json({ error: "Webhook not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Webhook deleted" });
}
