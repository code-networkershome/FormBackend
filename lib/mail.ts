export async function sendPasswordResetEmail(email: string, token: string) {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: "FormVibe <onboarding@resend.dev>",
            to: email,
            subject: "Reset your FormVibe password",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h2 style="color: #2563eb; margin: 0;">FormVibe</h2>
                    </div>
                    <h1 style="color: #1e293b; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Password Reset Request</h1>
                    <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">You requested a password reset for your FormVibe account. Click the button below to set a new password:</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">Reset Password</a>
                    </div>
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
                    <p style="color: #94a3b8; font-size: 12px;">If the button above doesn't work, copy and paste this link into your browser:</p>
                    <p style="color: #94a3b8; font-size: 12px; word-break: break-all;">${resetLink}</p>
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 FormVibe. All rights reserved.</p>
                </div>
            `,
        }),
    });

    if (!res.ok) {
        const error = await res.json();
        console.error("Resend API error:", error);
        throw new Error("Failed to send reset email");
    }

    return await res.json();
}
