import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/spam/ratelimit";

export const runtime = "edge";

const MAX_PAYLOAD_SIZE = 64 * 1024; // 64KB

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ formId: string }> }
) {
    const { formId } = await params;

    // 1. Method Validation (Next.js App Router handles this by exported methods, 
    // but we can add logic if extra methods are somehow reached or if we want custom 405 message)

    // 2. Content-Type Validation
    const contentType = req.headers.get("content-type") || "";
    const allowedTypes = ["application/json", "application/x-www-form-urlencoded", "multipart/form-data"];

    if (!allowedTypes.some(type => contentType.includes(type))) {
        return NextResponse.json(
            { error: "Unsupported Media Type. Please use JSON, Form-Data, or URLEncoded." },
            { status: 415 }
        );
    }

    // 3. Size Validation
    const contentLength = parseInt(req.headers.get("content-length") || "0");
    if (contentLength > MAX_PAYLOAD_SIZE) {
        return NextResponse.json(
            { error: "Payload too large. Max size is 64KB." },
            { status: 413 }
        );
    }

    // 4. Rate Limiting (IP based)
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (rateLimit) {
        const { success: isAllowed } = await rateLimit.limit(`${formId}_${ip}`);
        if (!isAllowed) {
            return NextResponse.json(
                { error: "Too many submissions. Please slow down." },
                { status: 429 }
            );
        }
    }

    // 5. Parse Payload
    let payload: Record<string, any> = {};

    try {
        if (contentType.includes("application/json")) {
            payload = await req.json();
            // Re-check size if JSON parsing happened (content-length might be unreliable)
            if (JSON.stringify(payload).length > MAX_PAYLOAD_SIZE) {
                return NextResponse.json({ error: "Payload too large." }, { status: 413 });
            }
        } else {
            const formData = await req.formData();
            payload = Object.fromEntries(formData.entries());
        }
    } catch (e) {
        return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
    }

    // 6. Honeypot Check (_gotcha field)
    if (payload._gotcha) {
        // Silent fail for bots - mimicking total success
        return NextResponse.json({ success: true, message: "Submission successful" });
    }

    // 7. Detect AJAX/JSON response requirement
    const acceptHeader = req.headers.get("accept") || "";
    const isAjax = acceptHeader.includes("application/json") || payload._format === "json";

    // 8. Forward to Internal Serverless Route
    // Fallback to current host if NEXT_PUBLIC_APP_URL is missing
    const origin = process.env.NEXT_PUBLIC_APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;

    try {
        const internalResponse = await fetch(`${origin}/api/internal/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-vibe-secret": process.env.INTERNAL_API_SECRET || "fallback-secret",
            },
            body: JSON.stringify({
                formId,
                payload,
                isAjax,
                metadata: {
                    ip,
                    ua: req.headers.get("user-agent"),
                    geo: req.headers.get("x-vercel-ip-country"),
                },
            }),
        });

        if (!internalResponse.ok) {
            const errorData = await internalResponse.json().catch(() => ({}));
            return NextResponse.json({ error: errorData.error || "Submission failed" }, { status: internalResponse.status });
        }

        const result = await internalResponse.json();

        // 9. Handle Redirection vs AJAX Response
        if (isAjax) {
            return NextResponse.json({ success: true, message: "Submission successful", redirect: result.redirectUrl });
        }

        if (result.redirectUrl) {
            return NextResponse.redirect(result.redirectUrl, 303);
        }

        // Default Success Page
        return NextResponse.redirect(`${origin}/thanks`, 303);
    } catch (e: any) {
        console.error("Submission processing error:", e);
        return NextResponse.json({ error: "Failed to process submission internally" }, { status: 500 });
    }
}

// Implement 405 for other methods explicitly if needed
export async function GET() { return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); }
export async function PUT() { return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); }
export async function DELETE() { return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 }); }

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
        },
    });
}
