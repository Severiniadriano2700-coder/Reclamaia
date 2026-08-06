import { NextResponse } from "next/server"
import { auth } from "@/auth"

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === "ADMIN"
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/api") && MUTATING_METHODS.has(req.method)) {
    const origin = req.headers.get("origin")
    if (origin && origin !== req.nextUrl.origin) {
      return NextResponse.json({ error: "Origen no permitido" }, { status: 403 })
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/api/:path*"],
}
