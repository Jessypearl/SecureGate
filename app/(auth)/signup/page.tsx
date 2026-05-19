// Sign Up page — form with email, password, password strength indicator

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions";
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
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
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
      <ul className="text-xs text-gray-500">
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

export default function SignupPage() {
  const [state, setState] = useState<ActionResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [password, setPassword] = useState("");

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await signup(null, formData);
      setState(result);
    });
  }

  if (state?.success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-2 text-gray-600">
          We sent a verification link. Click it to activate your account.
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

  return (
    <>
      <h1 className="text-2xl font-bold">Create an account</h1>
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
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <PasswordStrength password={password} />
        </div>
        {state && !state.success && (
          <p className="text-sm text-red-600">{state.error}</p>
        )}
        <SubmitButton loadingText="Creating account..." isPending={isPending}>
          Sign up
        </SubmitButton>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </p>
    </>
  );
}
