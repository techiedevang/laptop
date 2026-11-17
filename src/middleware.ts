import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 1. Security Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // Permissions-Policy: Camera & Microphone only permitted on video demo join pages
  if (pathname.startsWith("/meet")) {
    response.headers.set("Permissions-Policy", "camera=(self), microphone=(self), display-capture=(self)");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  } else {
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  }

  // 2. Sensitive Customer & Admin Route No-Index Protection
  const protectedRoutes = ["/admin", "/cart", "/checkout", "/account"];
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|images|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
