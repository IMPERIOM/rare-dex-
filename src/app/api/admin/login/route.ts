import { NextResponse } from "next/server";

/**
 * POST /api/admin/login
 * Sets the session cookie via Set-Cookie response header.
 * Does NOT use next/headers to avoid Route Handler cookie() issues in Next.js 15+.
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "info@raredexcards.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "@DrWorld89";

    if (email !== expectedEmail || password !== expectedPassword) {
      return NextResponse.json({ error: "Invalid admin email or password." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
