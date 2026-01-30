import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
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

    const { id: targetUserId } = await params;
    const { action } = await req.json();

    if (action !== "block" && action !== "unblock") {
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Guardrail: Prevent self-lockout
    if (targetUserId === session?.user?.id) {
        return NextResponse.json({ error: "Self-lockout protection: You cannot block yourself." }, { status: 400 });
    }

    try {
        const newStatus = action === "block" ? "blocked" : "active";

        await db
            .update(users)
            .set({ status: newStatus, updatedAt: new Date() })
            .where(eq(users.id, targetUserId));

        // Record Audit Log 🛡️
        await recordAuditLog({
            adminUserId: session?.user?.id!,
            action: action === "block" ? "BLOCK_USER" : "UNBLOCK_USER",
            targetType: "user",
            targetId: targetUserId,
        });

        return NextResponse.json({ success: true, status: newStatus });
    } catch (err) {
        console.error(`Failed to ${action} user:`, err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
