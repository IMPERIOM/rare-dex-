import { NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_EMAIL || "info@raredexcards.com";
    const expectedPassword = process.env.ADMIN_PASSWORD || "@DrWorld89";

    if (email === expectedEmail && password === expectedPassword) {
      await loginAdmin();
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid admin email or password." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
