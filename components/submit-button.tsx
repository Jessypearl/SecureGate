// Reusable submit button — pending state tracked via isPending prop

"use client";

export function SubmitButton({
  children,
  loadingText,
  isPending,
  className,
}: {
  children: React.ReactNode;
  loadingText: string;
  isPending: boolean;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className={
        className ??
        "w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      }
    >
      {isPending ? loadingText : children}
    </button>
  );
}
