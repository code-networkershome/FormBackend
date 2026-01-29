import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { accounts, sessions, users, verificationTokens, userCredentials } from "@/lib/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const { userCredentials, users } = await import("@/lib/db/schema");
                const { eq } = await import("drizzle-orm");

                // 1. Fetch user by email
                const user = await db.query.users.findFirst({
                    where: eq(users.email, credentials.email as string)
                });

                if (!user) return null;

                // 2. Fetch credentials
                const creds = await db.query.userCredentials.findFirst({
                    where: eq(userCredentials.userId, user.id)
                });

                if (!creds || !creds.passwordHash) return null;

                // 3. Verify Password
                const isValid = await bcrypt.compare(credentials.password as string, creds.passwordHash);
                if (!isValid) return null;

                // 4. Check Verification
                if (creds.emailVerified !== "true") {
                    throw new Error("EMAIL_NOT_VERIFIED");
                }

                return user;
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
