import { db } from "@/lib/db";
import { apiKeys, users } from "@/lib/db/schema";
import { desc, eq, count } from "drizzle-orm";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth/admin";

export async function GET(req: Request) {
    const { error } = await verifyAdmin();
    if (error) return error;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    try {
        // 1. Fetch Keys with User details
        const keys = await db.query.apiKeys.findMany({
            orderBy: [desc(apiKeys.createdAt)],
            limit: limit,
            offset: offset,
            with: {
                user: {
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
            .from(apiKeys);

        return NextResponse.json({
            data: keys,
            meta: {
                total: totalCount.value,
                page,
                limit,
                totalPages: Math.ceil(totalCount.value / limit)
            }
        });
    } catch (err) {
        console.error("Failed to fetch admin api keys:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
