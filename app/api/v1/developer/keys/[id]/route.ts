import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    const result = await db
        .delete(apiKeys)
        .where(and(
            eq(apiKeys.id, id),
            eq(apiKeys.userId, session.user.id)
        ))
        .returning();

    if (result.length === 0) {
        return NextResponse.json({ error: "Key not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "API Key revoked" });
}
