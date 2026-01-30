import { db } from "@/lib/db";
import { userCredentials, passwordResetTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
        }

        // 1. Hash the incoming token
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

        // 2. Find and Validate Token
        const resetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens.tokenHash, tokenHash)
        });

        if (!resetToken) {
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        if (resetToken.expiresAt < new Date()) {
            // Cleanup expired token
            await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, resetToken.id));
            return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });
        }

        // 3. Update Password
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.update(userCredentials)
            .set({ passwordHash: hashedPassword })
            .where(eq(userCredentials.userId, resetToken.userId));

        // 4. Cleanup Token
        await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, resetToken.id));

        return NextResponse.json({ message: "Password reset successfully. You can now log in." });

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
    }
}
