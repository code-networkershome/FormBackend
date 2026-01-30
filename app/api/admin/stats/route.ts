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
        // Note: Using raw SQL for date truncation to remain performant on indexed createdAt
        const dailySubmissions = await db.execute(sql`
            SELECT 
                DATE_TRUNC('day', created_at) as date,
                COUNT(*) as count
            FROM submissions
            WHERE created_at >= ${startDate}
            GROUP BY 1
            ORDER BY 1 ASC
        `);

        // 4. Top Users by Submission Volume
        const topUsers = await db.execute(sql`
            SELECT 
                u.id, 
                u.name, 
                u.email,
                COUNT(s.id) as submission_count
            FROM users u
            JOIN forms f ON f.owner_id = u.id
            JOIN submissions s ON s.form_id = f.id
            WHERE s.created_at >= ${startDate}
            GROUP BY u.id
            ORDER BY submission_count DESC
            LIMIT 5
        `);

        return NextResponse.json({
            summary: {
                totalUsers: userCount.value,
                totalForms: formCount.value,
                totalSubmissions: submissionCount.value,
                totalApiKeys: apiKeyCount.value,
                submissionsInRange: submissionsInRange.value,
            },
            charts: {
                dailySubmissions: dailySubmissions as any,
            },
            topUsers: topUsers as any,
        });
    } catch (err) {
        console.error("Failed to fetch admin stats:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
