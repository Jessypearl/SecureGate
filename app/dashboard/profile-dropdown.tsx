"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";

export function ProfileDropdown({
  email,
  initials,
}: {
  email: string;
  initials: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative border-t border-slate-800 px-6 py-4">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-3 text-left"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-slate-200">{email}</p>
          <p className="text-xs text-emerald-400">Verified</p>
        </div>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mx-2 mb-2 rounded-lg border border-slate-700 bg-slate-900 p-1 shadow-xl">
          <button
            onClick={() => signOut({ callbackUrl: "/auth" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-slate-800"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
