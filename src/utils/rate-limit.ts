type RateBucket = { count: number; resetAt: number }

const buckets = new Map<string, RateBucket>()

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const current = buckets.get(key)
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }
  if (current.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) }
  }
  current.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

export function clientRateLimitKey(request: Request, userId?: string) {
  if (userId) return `user:${userId}`
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "anonymous"
  return `ip:${ip}`
}
