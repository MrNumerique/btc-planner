import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, getExpectedSessionToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const expected = await getExpectedSessionToken();

  if (token && token === expected) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
