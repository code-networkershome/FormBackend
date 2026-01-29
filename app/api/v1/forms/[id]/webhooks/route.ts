import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { webhooks, forms } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { crypto } from "node:crypto";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;

    const results = await db
        .select({
            id: webhooks.id,
            url: webhooks.url,
            status: webhooks.status,
            createdAt: webhooks.createdAt,
        })
        .from(webhooks)
        .innerJoin(forms, eq(webhooks.formId, forms.id))
        .where(and(
            eq(webhooks.formId, id),
            eq(forms.ownerId, userId)
        ));

    return NextResponse.json(results);
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    const { id } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { url } = await req.json();

    if (!url) {
        return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Verify form ownership
    const [form] = await db
        .select()
        .from(forms)
        .where(and(
            eq(forms.id, id),
            eq(forms.ownerId, userId)
        ))
        .limit(1);

    if (!form) {
        return NextResponse.json({ error: "Form not found or unauthorized" }, { status: 404 });
    }

    // Generate signing secret
    const secret = Array.from(globalThis.crypto.getRandomValues(new Uint8Array(24)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const [newWebhook] = await db.insert(webhooks).values({
        formId: id,
        url,
        secret,
        status: "active",
    }).returning();

    return NextResponse.json(newWebhook);
}
