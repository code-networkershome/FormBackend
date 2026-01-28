import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Credentials({
            name: "Guest Access",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // HARDCODED BYPASS FOR LOCAL MVP TESTING
                if (credentials?.email === "guest@vibe.com" && credentials?.password === "guest123") {
                    const guestUser = {
                        id: "00000000-0000-0000-0000-000000000000",
                        name: "Guest User",
                        email: "guest@vibe.com"
                    };

                    // Ensure guest user exists in DB to satisfy FK constraints
                    try {
                        const { users } = await import("@/lib/db/schema");
                        await db.insert(users).values(guestUser).onConflictDoNothing();
                    } catch (e) {
                        console.error("Failed to ensure guest user exists:", e);
                    }

                    return guestUser;
                }
                return null;
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
