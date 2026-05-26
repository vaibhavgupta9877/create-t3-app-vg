// Uncomment and configure to enable rate limiting on your API routes.
// Requires: @upstash/ratelimit and @upstash/redis
// npm install @upstash/ratelimit @upstash/redis
// Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to your .env

// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// export const authRatelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(10, "60 s"),
//   analytics: true,
//   prefix: "ratelimit:auth",
// });

// export const apiRatelimit = new Ratelimit({
//   redis: Redis.fromEnv(),
//   limiter: Ratelimit.slidingWindow(100, "60 s"),
//   analytics: true,
//   prefix: "ratelimit:api",
// });

// Example usage in tRPC protected procedure:
// const ip = getClientIp(ctx.headers);
// const { success } = await authRatelimit.limit(ip);
// if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
