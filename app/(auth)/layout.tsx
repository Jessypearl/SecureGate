// Auth layout — centered card layout for login, signup, etc.

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-slate-950">
      <div className="w-full max-w-md rounded-lg bg-slate-900 border border-slate-800 p-8">
        {children}
      </div>
    </div>
  );
}
