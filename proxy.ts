import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  // const token = request.cookies.get("token")?.value;
  // const { pathname } = request.nextUrl;

  // Temporarily disabled for production cross-domain testing
  // Root cause: Vercel server (where this proxy runs) cannot read cookies set for Render domain.
  
  return NextResponse.next();
}

// Matching paths
export const config = {
  matcher: ["/dashboard/:path*", "/goals/:path*", "/career/:path*", "/finance/:path*", "/health/:path*", "/login"],
};
