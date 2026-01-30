import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Verifies if the current session belongs to an admin.
 * Returns the session if admin, or a NextResponse error if not.
 */
export async function verifyAdmin() {
    const session = await auth();

    if (!session?.user?.id) {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
    }

    if ((session.user as any).role !== "admin") {
        return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), session: null };
    }

    if ((session.user as any).status === "blocked") {
        return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
    }

    return { error: null, session };
}
