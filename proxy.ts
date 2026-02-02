import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  const protectedRoutes = ["/dashboard", "/goals", "/career", "/finance", "/health"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if logged in and trying to access login page
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Matching paths
export const config = {
  matcher: ["/dashboard/:path*", "/goals/:path*", "/career/:path*", "/finance/:path*", "/health/:path*", "/login"],
};
