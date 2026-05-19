// Email Verification page — handles token from query param, calls server action

"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/actions";
import Link from "next/link";
import type { ActionResult } from "@/lib/actions";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (token && !state) {
      const formData = new FormData();
      formData.set("token", token);
      startTransition(async () => {
        const result = await verifyEmail(null, formData);
        setState(result);
      });
    }
  }, [token, state, startTransition]);

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Invalid link</h1>
        <p className="mt-2 text-gray-600">
          This verification link is missing the token. Please check the link you
          received.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-blue-600 underline"
        >
          Go to login
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="mt-2 text-gray-600">Verifying your email...</p>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Email verified!</h1>
        <p className="mt-2 text-gray-600">
          Your account is now active. You can log in.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-blue-600 underline"
        >
          Go to login
        </Link>
      </div>
    );
  }

  if (state && !state.success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Link expired or invalid</h1>
        <p className="mt-2 text-gray-600">{state.error}</p>
        <Link
          href="/link-expired"
          className="mt-4 inline-block text-blue-600 underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return null;
}
