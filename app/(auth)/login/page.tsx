// Login page — email + password form with generic error handling

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Email and password are required.");
      setPending(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials.");
        setPending(false);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Service temporarily unavailable.");
      setPending(false);
    }
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Log in</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? "Logging in..." : "Log in"}
        </button>
      </form>
      <div className="mt-4 space-y-2 text-center text-sm">
        <p>
          <Link href="/forgot-password" className="text-blue-600 underline">
            Forgot your password?
          </Link>
        </p>
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-600 underline">
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
}
