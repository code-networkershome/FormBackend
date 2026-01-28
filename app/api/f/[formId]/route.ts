import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/spam/ratelimit";

export const runtime = "edge";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ formId: string }> }
) {
    const { formId } = await params;

    // 1. Rate Limiting (IP based)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success: isRateLimited } = await rateLimit.limit(`${formId}_${ip}`);

    if (!isRateLimited) {
        return NextResponse.json(
            { error: "Too many submissions. Please slow down." },
            { status: 429 }
        );
    }

    // 2. Parse Payload
    let payload: Record<string, any> = {};
    const contentType = req.headers.get("content-type") || "";

    try {
        if (contentType.includes("application/json")) {
            payload = await req.json();
        } else {
            const formData = await req.formData();
            payload = Object.fromEntries(formData.entries());
        }
    } catch (e) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 3. Honeypot Check (_gotcha field)
    if (payload._gotcha) {
        // Silent fail for bots
        return NextResponse.json({ success: true, message: "Submission successful" });
    }

    // 4. Forward to Internal Serverless Route
    // We use an internal secret to ensure only the Edge route can call the worker
    const internalResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/internal/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-vibe-secret": process.env.INTERNAL_API_SECRET!,
        },
        body: JSON.stringify({
            formId,
            payload,
            metadata: {
                ip,
                ua: req.headers.get("user-agent"),
                geo: req.headers.get("x-vercel-ip-country"),
            },
        }),
    });

    if (!internalResponse.ok) {
        const errorData = await internalResponse.json();
        return NextResponse.json({ error: errorData.message || "Submission failed" }, { status: internalResponse.status });
    }

    const result = await internalResponse.json();

    // 5. Handle Redirection
    if (result.redirectUrl) {
        return NextResponse.redirect(result.redirectUrl, 303);
    }

    return NextResponse.json({ success: true, message: "Submission successful" });
}

// Support OPTIONS for CORS if needed (though standard HTML forms don't need it)
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
