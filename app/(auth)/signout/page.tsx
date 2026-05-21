// Sign Out page â€” confirms signout by POSTing to NextAuth's signout endpoint

"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignoutPage() {
  const router = useRouter();

  async function handleSignout() {
    await signOut({ callbackUrl: "/auth" });
  }

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold">Sign out</h1>
      <p className="mt-2 text-slate-400">
        Are you sure you want to sign out?
      </p>
      <div className="mt-6 space-y-2">
        <button
          onClick={handleSignout}
          className="w-full rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Sign out
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full rounded bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
