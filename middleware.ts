// Middleware — auth guard and unverified redirect

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const isLoggedIn = !!req.auth;

  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/auth", baseUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isLoggedIn && nextUrl.pathname === "/auth" && !nextUrl.searchParams.has("mode")) {
    return NextResponse.redirect(new URL("/dashboard", baseUrl));
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
