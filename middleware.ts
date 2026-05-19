// Middleware — auth guard, unverified redirect, and rate limiting on /api/auth/signin

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

/*
 * Rate limiter: in-memory sliding window using a Map.
 *
 * Tradeoff vs Upstash Redis:
 *   - In-memory: zero latency, no external dependency, no cost.
 *     RESETS ON PROCESS RESTART — acceptable for a single-instance deployment
 *     but NOT safe for multi-instance (Vercel serverless) deployments.
 *   - Upstash Redis: persists across restarts, works globally across instances.
 *     Adds latency (~5ms), a paid dependency, and requires a Redis URL env var.
 *   - For production on Vercel (serverless), replace this with Upstash Redis.
 *     The interface is identical — swap Map.get/set for Redis commands.
 */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getRateLimitInfo(ip: string) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    const resetAt = now + RATE_LIMIT_WINDOW_MS;
    rateLimitStore.set(ip, { count: 1, resetAt });
    return { remaining: RATE_LIMIT_MAX - 1, resetAt };
  }

  record.count += 1;
  return { remaining: RATE_LIMIT_MAX - record.count, resetAt: record.resetAt };
}

export default auth((req) => {
  const { nextUrl } = req;

  // Rate limit POST requests to the NextAuth signin endpoint
  if (
    nextUrl.pathname === "/api/auth/signin" &&
    req.method === "POST"
  ) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    const { remaining, resetAt } = getRateLimitInfo(ip);

    if (remaining < 0) {
      const retryAfter = Math.ceil(
        (resetAt - Date.now()) / 1000,
      );

      return new NextResponse("Too many requests. Please try again later.", {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      });
    }
  }

  // In middleware context, req.auth is the decoded JWT (not the session callback output)
  const isLoggedIn = !!req.auth;
  const jwt = req.auth as { emailVerified?: boolean } | null;
  const isVerified = jwt?.emailVerified ?? false;

  // Protected route: /dashboard
  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (!isVerified) {
      const unverifiedUrl = new URL(
        "/unverified",
        process.env.NEXT_PUBLIC_APP_URL,
      );
      return NextResponse.redirect(unverifiedUrl);
    }
  }

  // Redirect logged-in users away from auth pages
  if (
    isLoggedIn &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/signup")
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL),
    );
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
