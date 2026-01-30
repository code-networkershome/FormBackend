import { db } from "@/lib/db";
import { apiKeys, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashKey } from "@/lib/api/keys";

export interface ApiKeySession {
    user: {
        id: string;
        role: string;
        status: string;
    };
    apiKeyId: string;
}

/**
 * Validates an API key and ensures the owner is active.
 * Used for programmatic access to API v1.
 */
export async function validateApiKey(header: string | null): Promise<ApiKeySession | null> {
    if (!header || !header.startsWith("Bearer ")) {
        return null;
    }

    const key = header.replace("Bearer ", "");
    if (!key) return null;

    const hashedKey = await hashKey(key);

    // 1. Find the API key
    const keyData = await db.query.apiKeys.findFirst({
        where: eq(apiKeys.keyHash, hashedKey),
        with: {
            user: true
        }
    });

    if (!keyData || !keyData.user) {
        return null;
    }

    // 2. Check if key is revoked
    if (keyData.status === "revoked") {
        return null;
    }

    // 3. Check if user is blocked
    if (keyData.user.status === "blocked") {
        return null;
    }

    // 3. Update last used at (non-blocking)
    db.update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, keyData.id))
        .execute()
        .catch(err => console.error("Failed to update lastUsedAt:", err));

    return {
        user: {
            id: keyData.user.id,
            role: keyData.user.role,
            status: keyData.user.status,
        },
        apiKeyId: keyData.id
    };
}
