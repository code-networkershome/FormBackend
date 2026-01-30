import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { checkPermission } from "@/lib/auth/permissions";
import { and, eq, lt, desc, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth/api-key";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    let session: any = await auth();
    const { id: formId } = await params;
    const { searchParams } = new URL(req.url);

    // Support API Key Authentication
    if (!session) {
        const apiKeySession = await validateApiKey(req.headers.get("Authorization"));
        if (apiKeySession) {
            session = apiKeySession;
        }
    }

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized", code: "API_KEY_INVALID" }, { status: 401 });
    }

    const isOwner = await checkPermission(session.user.id, formId);
    if (!isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const status = searchParams.get("status") as any;
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
        const cursor = searchParams.get("cursor"); // submission UUID

        const query = db
            .select()
            .from(submissions)
            .where(
                and(
                    eq(submissions.formId, formId),
                    status ? eq(submissions.status, status) : undefined,
                    cursor ? lt(submissions.id, cursor) : undefined // Simple cursor logic
                )
            )
            .orderBy(desc(submissions.createdAt))
            .limit(limit + 1);

        const results = await query;

        let nextCursor = null;
        if (results.length > limit) {
            const nextItem = results.pop();
            nextCursor = nextItem?.id;
        }

        return NextResponse.json({
            data: results,
            nextCursor,
        });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    let session: any = await auth();
    const { id: formId } = await params;

    // Support API Key Authentication
    if (!session) {
        const apiKeySession = await validateApiKey(req.headers.get("Authorization"));
        if (apiKeySession) {
            session = apiKeySession;
        }
    }

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized", code: "API_KEY_INVALID" }, { status: 401 });
    }

    const isOwner = await checkPermission(session.user.id, formId);
    if (!isOwner) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const { submissionIds, status } = await req.json();

        if (!submissionIds || !Array.isArray(submissionIds) || !status) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        await db
            .update(submissions)
            .set({ status, updatedAt: new Date() })
            .where(
                and(
                    eq(submissions.formId, formId),
                    inArray(submissions.id, submissionIds)
                )
            );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
