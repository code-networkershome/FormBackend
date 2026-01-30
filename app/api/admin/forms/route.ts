import { db } from "@/lib/db";
import { forms, users, submissions } from "@/lib/db/schema";
import { desc, eq, count, ilike, or, and, exists, sql } from "drizzle-orm";
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
        const data = await db
            .select({
                id: forms.id,
                name: forms.name,
                status: forms.status,
                createdAt: forms.createdAt,
                submissionCount: sql<number>`(SELECT count(*) FROM ${submissions} WHERE ${submissions.formId} = ${forms.id})`.mapWith(Number),
                owner: {
                    name: users.name,
                    email: users.email,
                }
            })
            .from(forms)
            .innerJoin(users, eq(forms.ownerId, users.id))
            .where(where)
            .orderBy(desc(forms.createdAt))
            .limit(limit)
            .offset(offset);

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
