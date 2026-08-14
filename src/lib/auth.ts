import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "admin_session";

/** For Server Components and pages — uses next/headers */
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_COOKIE_NAME);
    return session?.value === "authenticated";
  } catch {
    return false;
  }
}

/**
 * For Route Handlers — reads cookies directly from the raw Request.
 * next/headers cookies() can throw in Route Handler contexts in Next.js 15+.
 */
export function isAdminAuthenticatedFromRequest(request: Request): boolean {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map(c => {
      const [k, ...v] = c.trim().split("=");
      return [k.trim(), v.join("=").trim()];
    })
  );
  return cookies[SESSION_COOKIE_NAME] === "authenticated";
}

export async function loginAdmin() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: SESSION_COOKIE_NAME,
    value: "authenticated",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day session
  });
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
