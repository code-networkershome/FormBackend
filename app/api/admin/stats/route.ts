import { db } from "@/lib/db";
import { forms, submissions, users, apiKeys } from "@/lib/db/schema";
import { count, eq, gte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/admin";

export async function GET(req: Request) {
    const { error } = await verifyAdmin();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    let days = 7;
    if (range === "30d") days = 30;
    if (range === "90d") days = 90;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
        // 1. Total Metrics
        const [userCount] = await db.select({ value: count() }).from(users);
        const [formCount] = await db.select({ value: count() }).from(forms);
        const [submissionCount] = await db.select({ value: count() }).from(submissions);
        const [apiKeyCount] = await db.select({ value: count() }).from(apiKeys);

        // 2. Metrics in Range (Submissions)
        const [submissionsInRange] = await db
            .select({ value: count() })
            .from(submissions)
            .where(gte(submissions.createdAt, startDate));

        // 3. Submissions by Day (for charts)
        const dailySubmissionsResults = await db
            .select({
                date: sql<string>`DATE_TRUNC('day', ${submissions.createdAt})::text`,
                count: sql<number>`count(*)::int`,
            })
            .from(submissions)
            .where(gte(submissions.createdAt, startDate))
            .groupBy(sql`DATE_TRUNC('day', ${submissions.createdAt})`)
            .orderBy(sql`1 ASC`);

        // 4. Top Users by Submission Volume
        const topUsersQuery = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                submissionCount: sql<number>`count(${submissions.id})::int`,
            })
            .from(users)
            .leftJoin(forms, eq(forms.ownerId, users.id))
            .leftJoin(submissions, eq(submissions.formId, forms.id))
            .where(sql`${submissions.createdAt} >= ${startDate} OR ${submissions.id} IS NULL`)
            .groupBy(users.id, users.name, users.email)
            .orderBy(sql`4 DESC`)
            .limit(5);

        return NextResponse.json({
            summary: {
                totalUsers: userCount?.value || 0,
                totalForms: formCount?.value || 0,
                totalSubmissions: submissionCount?.value || 0,
                totalApiKeys: apiKeyCount?.value || 0,
                submissionsInRange: submissionsInRange?.value || 0,
            },
            charts: {
                dailySubmissions: dailySubmissionsResults || [],
            },
            topUsers: topUsersQuery || [],
        });
    } catch (err: any) {
        console.error("CRITICAL: Failed to fetch admin stats:", err);
        return NextResponse.json({
            error: "Internal Server Error",
            message: err.message,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        }, { status: 500 });
    }
}
