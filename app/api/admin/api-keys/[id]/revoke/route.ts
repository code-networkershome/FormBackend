import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/admin";
import { recordAuditLog } from "@/lib/auth/audit";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { error, session } = await verifyAdmin();
    if (error) return error;

    const { id: keyId } = await params;

    try {
        const [updatedKey] = await db
            .update(apiKeys)
            .set({ status: "revoked" })
            .where(eq(apiKeys.id, keyId))
            .returning();

        if (!updatedKey) {
            return NextResponse.json({ error: "API Key not found" }, { status: 404 });
        }

        // Record Audit Log 🛡️
        await recordAuditLog({
            adminUserId: session?.user?.id!,
            action: "REVOKE_API_KEY",
            targetType: "api_key",
            targetId: keyId,
            metadata: { keyName: updatedKey.name }
        });

        return NextResponse.json({ success: true, status: "revoked" });
    } catch (err) {
        console.error("Failed to revoke API key:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
