import { createHmac } from "node:crypto";

const WEBHOOK_TIMEOUT = 3000; // 3 seconds per delivery

interface WebhookPayload {
    event: "submission.created";
    formId: string;
    submission: {
        id: string;
        payload: any;
        metadata: any;
        createdAt: string;
    };
}

/**
 * Delivers a webhook payload to the specified URL.
 * Includes security guardrails: 3s timeout and HMAC signature.
 */
export async function deliverWebhook(url: string, secret: string, payload: WebhookPayload): Promise<void> {
    const body = JSON.stringify(payload);

    // Generate HMAC signature
    const hmac = createHmac("sha256", secret);
    const signature = hmac.update(body).digest("hex");

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-FormVibe-Signature": signature,
                "X-FormVibe-Event": payload.event,
                "User-Agent": "FormVibe-Webhooks/1.0"
            },
            body,
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`[Webhook] Delivery to ${url} failed with status: ${response.status}`);
        }
    } catch (error: any) {
        if (error.name === "AbortError") {
            console.error(`[Webhook] Delivery to ${url} timed out after ${WEBHOOK_TIMEOUT}ms`);
        } else {
            console.error(`[Webhook] Delivery to ${url} error:`, error.message);
        }
        // Failure is swallowed as per guardrail policy
    }
}

/**
 * Higher-level utility to trigger all webhooks for a form.
 * Should be called in a "fire-and-forget" manner.
 */
export async function triggerWebhooks(webhooks: { url: string; secret: string }[], payload: WebhookPayload): Promise<void> {
    // Execute all deliveries
    // We don't await them as a block to avoid slowing down the internal submission flow longer than necessary
    // but the actual call to triggerWebhooks should ideally be handled without awaiting anyway.
    await Promise.allSettled(webhooks.map(w => deliverWebhook(w.url, w.secret, payload)));
}
