import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "frontend_token";
// Matches ACCESS_TOKEN_EXPIRE_MINUTES on the backend
const MAX_AGE = 60 * 60;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const token: unknown = body?.access_token;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
