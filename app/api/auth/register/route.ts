import { db } from "@/lib/db";
import { users, userCredentials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiting (Upstash)
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
});

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(5, "10 m"), // 5 registrations per 10 minutes per IP
    analytics: true,
    prefix: "@upstash/ratelimit/register",
});

export async function POST(req: Request) {
    try {
        // 1. Rate Limiting
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = await ratelimit.limit(ip);
        if (!success) {
            return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 });
        }

        const { email, password, name } = await req.json();

        // 2. Validation
        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Password Policy: Min 8 chars, at least one number or special char
        const passwordRegex = /^(?=.*[0-9!@#$%^&*])(?=.{8,})/;
        if (!passwordRegex.test(password)) {
            return NextResponse.json({
                error: "Password must be at least 8 characters long and contain at least one number or special character."
            }, { status: 400 });
        }

        // 3. Check Duplicate
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }

        // 4. Create User
        const newUser = await db.insert(users).values({
            email,
            name,
        }).returning({ id: users.id });

        const userId = newUser[0].id;

        // 5. Hash & Store Credentials
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.insert(userCredentials).values({
            userId,
            passwordHash: hashedPassword,
            emailVerified: "false",
        });

        const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify?userId=${userId}`;

        return NextResponse.json({
            message: `Account created successfully! For testing, verify here: ${verificationLink}`,
            userId
        });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
    }
}
