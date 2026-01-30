import { db } from "@/lib/db";
import { forms, users } from "@/lib/db/schema";
import { desc, eq, count, ilike, or, and, exists } from "drizzle-orm";
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

    const where = search ? or(
        ilike(forms.name, `%${search}%`),
        exists(
            db.select()
                .from(users)
                .where(and(eq(users.id, forms.ownerId), ilike(users.email, `%${search}%`)))
        )
    ) : undefined;

    try {
        const data = await db.query.forms.findMany({
            where,
            orderBy: [desc(forms.createdAt)],
            limit: limit,
            offset: offset,
            with: {
                owner: {
                    columns: {
                        name: true,
                        email: true,
                    }
                }
            }
        });

        const [totalCount] = await db
            .select({ value: count() })
            .from(forms)
            .where(where);

        return NextResponse.json({
            data,
            meta: {
                total: totalCount.value,
                page,
                limit,
                totalPages: Math.ceil(totalCount.value / limit)
            }
        });
    } catch (err) {
        console.error("Failed to fetch admin forms:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
