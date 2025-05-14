import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getServerAuth } from "./lib/auth"

export function middleware(request: NextRequest) {
  const { isAuthenticated, isAdmin } = getServerAuth()
  const path = request.nextUrl.pathname

  // Protect admin routes
  if (path.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Redirect authenticated users away from login/register
  if ((path === "/login" || path === "/register") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
}
