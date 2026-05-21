// Link Expired page â€” shown when a verification or reset token is invalid/expired

import Link from "next/link";

export default function LinkExpiredPage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Link expired</h1>
      <p className="mt-2 text-slate-400">
        This link is no longer valid. Request a new one below.
      </p>
      <div className="mt-6 space-y-2">
        <Link
          href="/forgot-password"
          className="block text-indigo-400 underline"
        >
          Request new password reset
        </Link>
        <Link href="/auth" className="block text-indigo-400 underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
