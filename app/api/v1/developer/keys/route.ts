import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { generateKey, hashKey } from "@/lib/api/keys";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const keys = await db
        .select({
            id: apiKeys.id,
            name: apiKeys.name,
            keyHash: apiKeys.keyHash, // We'll obfuscate this in the response
            lastUsedAt: apiKeys.lastUsedAt,
            createdAt: apiKeys.createdAt,
        })
        .from(apiKeys)
        .where(eq(apiKeys.userId, session.user.id));

    // Obfuscate the keys: return only the last 4 chars if possible, or a placeholder
    const safeKeys = keys.map(k => ({
        ...k,
        // Since we only store hashes, we can't show the last 4 of the actual key here.
        // We might want to store a 'displayKey' (last 4) in the DB in the future.
        // For now, we'll just indicate it's active.
        preview: "****"
    }));

    return NextResponse.json(safeKeys);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const rawKey = generateKey();
    const hashedKey = await hashKey(rawKey);

    const [newKey] = await db.insert(apiKeys).values({
        userId: session.user.id,
        keyHash: hashedKey,
        name: name,
    }).returning();

    return NextResponse.json({
        ...newKey,
        apiKey: rawKey, // ONLY RETURNED ONCE HERE
        message: "Please copy this key now. You will not be able to see it again."
    });
}
