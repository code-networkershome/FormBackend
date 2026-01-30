import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc, ilike, or, sql, count } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/admin";

export async function GET(req: Request) {
    const { error } = await verifyAdmin();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");
    const offset = (page - 1) * limit;

    try {
        const whereClause = search
            ? or(
                ilike(users.email, `%${search}%`),
                ilike(users.name, `%${search}%`)
            )
            : undefined;

        // 1. Fetch Users
        const userList = await db.query.users.findMany({
            where: whereClause,
            orderBy: [desc(users.createdAt)],
            limit: limit,
            offset: offset,
        });

        // 2. Total Count for Pagination
        const [totalCount] = await db
            .select({ value: count() })
            .from(users)
            .where(whereClause);

        return NextResponse.json({
            data: userList,
            meta: {
                total: totalCount.value,
                page,
                limit,
                totalPages: Math.ceil(totalCount.value / limit)
            }
        });
    } catch (err) {
        console.error("Failed to fetch admin users:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
