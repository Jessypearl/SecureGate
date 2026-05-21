// Reusable submit button — pending state tracked via isPending prop

"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  loadingText,
  className,
}: {
  children: React.ReactNode;
  loadingText: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={
        className ??
        "w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      }
    >
      {pending ? loadingText : children}
    </button>
  );
}
