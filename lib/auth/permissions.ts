import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * Checks if a user is the owner of a form.
 * Returns true if owner, false otherwise.
 */
export async function checkPermission(
    userId: string,
    formId: string
) {
    const [form] = await db
        .select({ id: forms.id })
        .from(forms)
        .where(and(eq(forms.id, formId), eq(forms.ownerId, userId)))
        .limit(1);

    return !!form;
}
