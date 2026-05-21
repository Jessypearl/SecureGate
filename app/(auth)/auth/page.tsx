"use client";

import { Suspense, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { signup } from "@/lib/actions";
import { SubmitButton } from "@/components/submit-button";
import type { ActionResult } from "@/lib/actions";

function PasswordInput({
  id,
  label,
  value,
  onChange,
  onBlur,
  showToggle,
  linkRight,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  showToggle?: boolean;
  linkRight?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-slate-300">
          {label}
        </label>
        {linkRight}
      </div>
      <div className="relative mt-1">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="block w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 pr-10 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
            tabIndex={-1}
          >
            {show ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

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

function AuthPage() {
  // Router & Params
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const mode = searchParams.get("mode");

  const [isLogin, setIsLogin] = useState(mode !== "signup");

  // Login State
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginPending, setLoginPending] = useState(false);

  // Signup State
  const [signupState, signupAction] = useFormState(signup, null);

  // Shared Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  function resetForm() {
    setEmail("");
    setPassword("");
    setTouched({ email: false, password: false });
    setLoginError(null);
  }

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError(null);
    setLoginPending(true);

    if (!email || !password) {
      setLoginError("Email and password are required.");
      setLoginPending(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Invalid email or password.");
        setLoginPending(false);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch {
      setLoginError("Service temporarily unavailable.");
      setLoginPending(false);
    }
  }



  // If signup was successful, show verification message
  if (!isLogin && signupState?.success) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="mt-2 text-gray-600">
          We sent a verification link. Click it to activate your account.
        </p>
        <button
          onClick={() => setIsLogin(true)}
          className="mt-4 inline-block text-indigo-400 underline"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center text-2xl font-bold">{isLogin ? "Log in" : "Create Account"}</h1>
      
      {isLogin ? (
        // LOGIN FORM
        <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              className="mt-1 block w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {touched.email && !email && (
              <p className="mt-1 text-sm text-red-400">Please enter your email</p>
            )}
            {email && !email.includes("@") && (
              <p className="mt-1 text-sm text-red-400">Please enter a valid email</p>
            )}
          </div>
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            showToggle
            linkRight={
              <Link href="/forgot-password" className="text-xs text-indigo-400 underline">
                Forgot password?
              </Link>
            }
          />
          {touched.password && !password && (
            <p className="-mt-3 text-sm text-red-400">Please enter your password</p>
          )}
          {loginError && <p className="text-sm text-red-400">{loginError}</p>}
          <button
            type="submit"
            disabled={loginPending}
            className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loginPending ? "Logging in..." : "Log in"}
          </button>
        </form>
      ) : (
        // SIGNUP FORM
        <form action={signupAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Enter Your Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              className="mt-1 block w-full rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {touched.email && !email && (
              <p className="mt-1 text-sm text-red-400">This field cannot be empty</p>
            )}
            {email && !email.includes("@") && (
              <p className="mt-1 text-sm text-red-400">Please enter a valid email</p>
            )}
          </div>
          <PasswordInput
            id="password"
            label="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur("password")}
            showToggle
          />
          {touched.password && !password && (
            <p className="mt-1 text-sm text-red-400">This field cannot be empty</p>
          )}
          <PasswordStrength password={password} />
          {signupState && !signupState.success && (
            <p className="text-sm text-red-400">{signupState.error}</p>
          )}
          <SubmitButton loadingText="Creating account...">
            Create Account
          </SubmitButton>
        </form>
      )}

      {/* TOGGLE & LINKS */}
      <div className="mt-4 space-y-2 text-center text-sm">
        {isLogin ? (
          <>
            <p>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => { resetForm(); setIsLogin(false); }}
                className="text-indigo-400 underline bg-transparent border-none p-0 cursor-pointer"
              >
                Sign up
              </button>
            </p>
          </>
        ) : (
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => { resetForm(); setIsLogin(true); }}
              className="text-indigo-400 underline bg-transparent border-none p-0 cursor-pointer"
            >
              Log in
            </button>
          </p>
        )}
      </div>
    </>
  );
}

export default function AuthPageWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
}
