// Dashboard page — protected, only accessible to authenticated + verified users

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user.emailVerified) {
    redirect("/unverified");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome, {session.user.email}!
        </p>
        <p className="mt-1 text-sm text-green-600">Email verified ✓</p>
        <div className="mt-6 space-y-2">
          <Link
            href="/signout"
            className="block text-sm text-red-600 underline"
          >
            Log out
          </Link>
        </div>
      </div>
    </div>
  );
}
