import { NextResponse } from "next/server"

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for")
  if (forwardedFor) return forwardedFor.split(",")[0].trim()
  return req.headers.get("x-real-ip") ?? "unknown"
}

/**
 * In-memory fixed-window limiter. Fine for a single Node instance; swap for a
 * shared store (e.g. Upstash Redis) once running multiple instances.
 */
export async function withRateLimit(
  req: Request,
  scope: string,
  limit: number,
  windowSeconds: number
) {
  const ip = getClientIp(req)
  const key = `${scope}:${ip}`
  const now = Date.now()

  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return null
  }

  if (bucket.count >= limit) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000)
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Inténtalo de nuevo en unos segundos." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    )
  }

  bucket.count += 1
  return null
}
