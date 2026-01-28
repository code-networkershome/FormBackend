import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { forms, submissions } from "@/lib/db/schema";
import { and, eq, or, count, gte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate UUID format to prevent Postgres crash on stale/guest sessions
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(session.user.id)) {
        console.warn("Invalid UUID in session, likely stale. Returning empty stats.");
        return NextResponse.json({ total: 0, unread: 0, spam: 0, trend: [] });
    }

    try {
        const userId = session.user.id;

        // 1. Get all owned form IDs
        const userForms = await db
            .select({ id: forms.id })
            .from(forms)
            .where(eq(forms.ownerId, userId));

        const formIds = userForms.map((f) => f.id);

        if (formIds.length === 0) {
            return NextResponse.json({
                total: 0,
                unread: 0,
                spam: 0,
                trend: [],
            });
        }

        // 2. Aggregate stats
        const stats = await db
            .select({
                status: submissions.status,
                count: count(submissions.id),
            })
            .from(submissions)
            .where(sql`${submissions.formId} IN ${formIds}`) // Simplified list check
            .groupBy(submissions.status);

        const total = stats.reduce((acc, curr) => acc + Number(curr.count), 0);
        const unread = Number(stats.find((s) => s.status === "unread")?.count || 0);
        const spam = Number(stats.find((s) => s.status === "spam")?.count || 0);

        // 3. 7-day trend
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trend = await db
            .select({
                date: sql<string>`DATE(${submissions.createdAt})`,
                count: count(submissions.id),
            })
            .from(submissions)
            .where(
                and(
                    sql`${submissions.formId} IN ${formIds}`,
                    gte(submissions.createdAt, sevenDaysAgo)
                )
            )
            .groupBy(sql`DATE(${submissions.createdAt})`)
            .orderBy(sql`DATE(${submissions.createdAt})`);

        return NextResponse.json({
            total,
            unread,
            spam,
            trend,
        });
    } catch (error: any) {
        console.error("DEBUG - Analytics Error:", {
            message: error.message,
            code: error.code,
            detail: error.detail,
            table: error.table,
            stack: error.stack
        });
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
