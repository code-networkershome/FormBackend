import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate UUID format to prevent Postgres crash on stale/guest sessions
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(session.user.id)) {
        console.warn("Invalid UUID in session, likely stale. Returning empty.");
        return NextResponse.json([]);
    }

    try {
        // 1. Fetch forms where user is owner
        // 2. Fetch forms where user is a collaborator
        // In Drizzle, we can use an OR with a join or just subqueries.
        // For simplicity, we'll fetch forms where id is in the list of allowed forms.

        const userForms = await db
            .select({
                id: forms.id,
                name: forms.name,
                status: forms.status,
                updatedAt: forms.updatedAt,
            })
            .from(forms)
            .where(eq(forms.ownerId, session.user.id))
            .orderBy(forms.updatedAt);

        return NextResponse.json(userForms);
    } catch (error: any) {
        console.error("DEBUG - Failed to fetch forms:", {
            message: error.message,
            code: error.code,
            detail: error.detail,
            table: error.table,
            stack: error.stack
        });
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, templateId } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const [newForm] = await db
            .insert(forms)
            .values({
                name,
                ownerId: session.user.id,
                templateId: templateId || null,
            })
            .returning();

        return NextResponse.json(newForm);
    } catch (error) {
        console.error("Failed to create form:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
