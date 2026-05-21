// Reset Password page — new password form with token from query param

"use client";

import { Suspense, useState } from "react";
import { useFormState } from "react-dom";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/actions";
import { SubmitButton } from "@/components/submit-button";

function EyeIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Lowercase", pass: /[a-z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];

  const unmet = checks.filter((c) => !c.pass);
  if (unmet.length === 0) return null;

  return (
    <ul className="mt-2 text-xs text-slate-400 space-y-1">
      {unmet.map((check) => (
        <li key={check.label} className="flex items-center gap-1">
          <span>{"\u25CB"}</span>
          {check.label}
        </li>
      ))}
    </ul>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
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
          <div className="relative mt-1">
            <input
              id="password"
              name="password"
              type={show ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 pr-10 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              tabIndex={-1}
            >
              {show ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
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
