// Email Verification page â€” handles token from query param, calls server action

"use client";

import { Suspense, useState, useTransition, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { verifyEmail } from "@/lib/actions";
import Link from "next/link";
import type { ActionResult } from "@/lib/actions";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const attempted = useRef(false);

  useEffect(() => {
    if (token && !state && !attempted.current) {
      attempted.current = true;
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
        <p className="mt-2 text-slate-400">
          This verification link is missing the token. Please check the link you
          received.
        </p>
        <Link
          href="/auth"
          className="mt-4 inline-block text-indigo-400 underline"
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
        <p className="mt-2 text-slate-400">Verifying your email...</p>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Email verified!</h1>
        <p className="mt-2 text-slate-400">
          Your account is now active. You can log in.
        </p>
        <Link
          href="/auth?mode=login"
          className="mt-4 inline-block text-indigo-400 underline"
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
        <p className="mt-2 text-slate-400">{state.error}</p>
        <Link
          href="/auth"
          className="mt-4 inline-block text-indigo-400 underline"
        >
          Sign up again to receive a new verification link
        </Link>
      </div>
    );
  }

  return null;
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
