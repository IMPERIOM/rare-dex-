import { NextResponse } from "next/server";

/**
 * POST /api/admin/logout
 * Revokes the admin session by expiring the cookie via Set-Cookie response header.
 * Does NOT use next/headers (avoids the Route Handler cookie() bug in Next.js 15+).
 */
export async function POST() {
  const response = NextResponse.json({ success: true });

  // Delete the session cookie by setting it with maxAge=0 / expires in the past
  response.cookies.set("admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
