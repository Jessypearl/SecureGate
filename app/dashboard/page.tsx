import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProfileDropdown } from "./profile-dropdown";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  if (!session.user.emailVerified) {
    redirect("/unverified");
  }

  const email = session.user.email ?? "";
  const initials = email.charAt(0).toUpperCase();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
            SG
          </div>
          <span className="text-lg font-semibold text-slate-100">SecureGate</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          <SidebarLink href="/dashboard" active>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Dashboard
          </SidebarLink>
        </nav>
        <ProfileDropdown email={email} initials={initials} />
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 md:px-8 h-16">
          <div className="flex items-center gap-3 md:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
              SG
            </div>
            <span className="text-lg font-semibold">SecureGate</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </div>
            <Link
              href="/signout"
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-white md:hidden"
            >
              Sign out
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Welcome banner */}
          <div className="mb-8 rounded-xl border border-slate-800 bg-gradient-to-r from-indigo-600/10 to-cyan-600/10 p-6">
            <h2 className="text-2xl font-bold text-slate-100">
              Welcome back, Jessica!
            </h2>
            <p className="mt-1 text-slate-400">
              Here&apos;s what&apos;s happening with your account today.
            </p>
          </div>

          {/* Stats grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Account Status"
              value="Active"
              icon={
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              }
              color="emerald"
            />
            <StatCard
              label="Email"
              value="Verified"
              icon={
                <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              }
              color="indigo"
            />
            <StatCard
              label="Member Since"
              value="Today"
              icon={
                <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              }
              color="cyan"
            />
            <StatCard
              label="Security"
              value="Strong"
              icon={
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              }
              color="amber"
            />
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h3 className="text-lg font-semibold text-slate-100">Quick Actions</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <QuickAction
                href="/forgot-password"
                label="Reset Password"
                description="Change your current password"
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                }
              />
              <QuickAction
                href="/signout"
                label="Sign Out"
                description="End your current session"
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                }
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
      }`}
    >
      {children}
    </Link>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, string> = {
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
    indigo: "from-indigo-500/20 to-indigo-500/5 border-indigo-500/20",
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  };

  return (
    <div className={`rounded-xl border bg-gradient-to-br p-5 ${colors[color] ?? colors.indigo}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-100">{value}</p>
    </div>
  );
}

function QuickAction({
  href,
  label,
  description,
  icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-slate-800 bg-slate-900/30 p-4 transition-all hover:border-slate-700 hover:bg-slate-800/50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600/20">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-200">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
