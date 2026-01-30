import { db } from "@/lib/db";
import { users, passwordResetTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/mail";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
});

const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "@upstash/ratelimit/forgot-password",
});

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await ratelimit.limit(ip);
        if (!success) {
            return NextResponse.json({ error: "Too many attempts. Please try again in an hour." }, { status: 429 });
        }

        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

        // 1. Generic Response to prevent enumeration
        const genericResponse = NextResponse.json({ message: "If an account exists with this email, a reset link has been sent." });

        // 2. Find User
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (!user) return genericResponse;

        // 3. Generate Token
        // Using a 32-byte (64 hex chars) secure random token
        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        // 4. Store Token (One per user)
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, user.id));
        await db.insert(passwordResetTokens).values({
            userId: user.id,
            tokenHash,
            expiresAt,
        });

        // 5. Send Email (Send raw token)
        await sendPasswordResetEmail(email, token);

        return genericResponse;

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}
