
const PREFIX = "fv_";
const KEY_LENGTH = 32;

/**
 * Generates a new cryptographically secure API key.
 * Format: fv_[32_random_chars]
 */
export function generateKey(): string {
    const randomChars = Array.from(globalThis.crypto.getRandomValues(new Uint8Array(KEY_LENGTH)))
        .map((b) => b.toString(36))
        .join("")
        .substring(0, KEY_LENGTH);

    return `${PREFIX}${randomChars}`;
}

/**
 * Hashes an API key for secure storage.
 * Uses SHA-256 (no salt needed for high-entropy keys, but we can add one if desired).
 * In this implementation, the key itself is high entropy.
 */
export async function hashKey(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await globalThis.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates an incoming API key against a stored hash.
 */
export async function validateKey(key: string, storedHash: string): Promise<boolean> {
    const incomingHash = await hashKey(key);
    return incomingHash === storedHash;
}
