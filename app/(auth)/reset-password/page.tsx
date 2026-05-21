// Reset Password page â€” new password form with token from query param

"use client";

import { Suspense, useState } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/actions";
import { SubmitButton } from "@/components/submit-button";
import type { ActionResult } from "@/lib/actions";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Lowercase", pass: /[a-z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];

  const passed = checks.filter((c) => c.pass).length;

  return (
    <div className="mt-2 space-y-1">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all ${
            passed === 0
              ? "w-0"
              : passed <= 2
                ? "w-1/3 bg-red-500"
                : passed === 3
                  ? "w-2/3 bg-yellow-500"
                  : "w-full bg-green-500"
          }`}
        />
      </div>
      <ul className="text-xs text-slate-400">
        {checks.map((check) => (
          <li key={check.label} className="flex items-center gap-1">
            <span>{check.pass ? "\u2713" : "\u25CB"}</span>
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [state, formAction] = useFormState(resetPassword, null);

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Invalid link</h1>
        <p className="mt-2 text-slate-400">
          This reset link is missing the token. Please check the link you
          received.
        </p>
        <Link
          href="/forgot-password"
          className="mt-4 inline-block text-indigo-400 underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Password reset</h1>
        <p className="mt-2 text-slate-400">
          Your password has been updated successfully.
        </p>
        <Link
          href="/auth"
          className="mt-4 inline-block text-indigo-400 underline"
        >
          Log in with new password
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Set new password</h1>
      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="token" value={token ?? ""} />
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <PasswordStrength password={password} />
        </div>
        {state && !state.success && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
        <SubmitButton loadingText="Resetting...">
          Reset password
        </SubmitButton>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
