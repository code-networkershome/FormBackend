import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    // 1. Protect Dashboard Routes
    const isDashboardRoute = nextUrl.pathname.startsWith("/forms") || nextUrl.pathname.startsWith("/api/v1");
    if (isDashboardRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", nextUrl));
    }

    // 2. Protect Internal Routes
    const isInternalRoute = nextUrl.pathname.startsWith("/api/internal");
    if (isInternalRoute) {
        const secret = req.headers.get("x-vibe-secret");
        if (secret !== process.env.INTERNAL_API_SECRET) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)", "/api/v1/:path*", "/api/internal/:path*"],
};
