import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redisUrl = process.env.UPSTASH_REDIS_URL;
const redisToken = process.env.UPSTASH_REDIS_TOKEN;

if (!redisUrl || !redisToken) {
    console.warn("Spam protection (Redis) is not configured. Rate limiting is disabled.");
}

export const redis = (redisUrl && redisToken) ? new Redis({
    url: redisUrl,
    token: redisToken,
}) : null;

export const rateLimit = redis ? new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, "10 s"),
    analytics: true,
    prefix: "@formvibe/ratelimit",
}) : null;
