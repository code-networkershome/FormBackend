import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { forms } from "@/lib/db/schema";
import { checkPermission } from "@/lib/auth/permissions";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isOwner = await checkPermission(session.user.id, id);
    if (!isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const [form] = await db
            .select()
            .from(forms)
            .where(eq(forms.id, id))
            .limit(1);

        return NextResponse.json(form);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isOwner = await checkPermission(session.user.id, id);
    if (!isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { name, status, settings } = body;

        console.log(`[Form Update] id=${id} status=${status} settings=${JSON.stringify(settings)}`);

        const [updatedForm] = await db
            .update(forms)
            .set({
                ...(name && { name }),
                ...(status && { status }),
                ...(settings && { settings }),
                updatedAt: new Date(),
            })
            .where(eq(forms.id, id))
            .returning();

        return NextResponse.json(updatedForm);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isOwner = await checkPermission(session.user.id, id);
    if (!isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        await db.delete(forms).where(eq(forms.id, id));
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
