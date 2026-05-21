// Forgot Password page â€” email input, sends reset link via Resend

"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import { forgotPassword } from "@/lib/actions";
import { SubmitButton } from "@/components/submit-button";
import type { ActionResult } from "@/lib/actions";

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(forgotPassword, null);

  if (state?.success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-2 text-slate-400">
          If an account with that email exists, we sent a password reset link.
        </p>
        <Link
          href="/auth"
          className="mt-4 inline-block text-indigo-400 underline"
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Reset your password</h1>
      <p className="mt-2 text-sm text-slate-400">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        {state && !state.success && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
        <SubmitButton loadingText="Sending...">
          Send reset link
        </SubmitButton>
      </form>
      <p className="mt-4 text-center text-sm text-slate-400">
        <Link href="/auth" className="text-indigo-400 underline">
          Back to login
        </Link>
      </p>
    </>
  );
}
