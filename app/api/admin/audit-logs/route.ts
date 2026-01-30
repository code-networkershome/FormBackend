import { db } from "@/lib/db";
import { adminAuditLogs, users } from "@/lib/db/schema";
import { desc, eq, count, ilike, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/admin";

export async function GET(req: Request) {
    const { error } = await verifyAdmin();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const where = search
        ? or(
            ilike(adminAuditLogs.action, `%${search}%`),
            ilike(adminAuditLogs.targetId, `%${search}%`)
        )
        : undefined;

    try {
        // 1. Fetch Logs with Admin User details
        const logs = await db.query.adminAuditLogs.findMany({
            where,
            orderBy: [desc(adminAuditLogs.createdAt)],
            limit: limit,
            offset: offset,
            with: {
                admin: {
                    columns: {
                        name: true,
                        email: true,
                    }
                }
            }
        });

        // 2. Total Count for Pagination
        const [totalCount] = await db
            .select({ value: count() })
            .from(adminAuditLogs)
            .where(where);

        return NextResponse.json({
            data: logs,
            meta: {
                total: totalCount.value,
                page,
                limit,
                totalPages: Math.ceil(totalCount.value / limit)
            }
        });
    } catch (err) {
        console.error("Failed to fetch admin audit logs:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
