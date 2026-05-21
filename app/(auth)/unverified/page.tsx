// Unverified notice page â€” shown when an authenticated user has not verified their email

import Link from "next/link";

export default function UnverifiedPage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Email not verified</h1>
      <p className="mt-2 text-slate-400">
        You need to verify your email address before accessing the dashboard.
        Check your inbox for the verification link.
      </p>
      <div className="mt-6 space-y-2">
        <Link href="/dashboard" className="block text-indigo-400 underline">
          Try again
        </Link>
        <Link href="/auth" className="block text-indigo-400 underline">
          Log in with a different account
        </Link>
      </div>
    </div>
  );
}
