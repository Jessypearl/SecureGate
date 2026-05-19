// Forgot Password page — email input, sends reset link via Resend

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/actions";
import { SubmitButton } from "@/components/submit-button";
import type { ActionResult } from "@/lib/actions";

export default function ForgotPasswordPage() {
  const [state, setState] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await forgotPassword(null, formData);
      setState(result);
    });
  }

  if (state?.success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-2 text-gray-600">
          If an account with that email exists, we sent a password reset link.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block text-blue-600 underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <p className="mt-2 text-sm text-gray-600">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form action={handleSubmit} className="mt-6 space-y-4">
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
        {state && !state.success && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
        <SubmitButton loadingText="Sending..." isPending={isPending}>
          Send reset link
        </SubmitButton>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        <Link href="/login" className="text-blue-600 underline">
          Back to login
        </Link>
      </p>
    </>
  );
}
