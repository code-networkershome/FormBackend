import { db } from "@/lib/db";
import { userCredentials } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "Missing User ID" }, { status: 400 });
        }

        // In a real system, you would verify a HMAC/JWT token here.
        // For this MVP, we will mark as verified if the ID exists.

        await db.update(userCredentials)
            .set({ emailVerified: "true" })
            .where(eq(userCredentials.userId, userId));

        return new Response(`
            <html>
                <head><title>Verification Successful</title></head>
                <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f8fafc;">
                    <div style="background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                        <h1 style="color: #10b981; margin-bottom: 0.5rem;">Verification Successful!</h1>
                        <p style="color: #64748b; margin-bottom: 1.5rem;">Your identity has been confirmed. You can now log in to FormVibe.</p>
                        <a href="/login" style="background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600;">Back to Login</a>
                    </div>
                </body>
            </html>
        `, {
            headers: { "Content-Type": "text/html" }
        });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}
