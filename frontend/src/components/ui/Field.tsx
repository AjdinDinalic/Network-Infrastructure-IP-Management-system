import type { ReactNode } from "react";

export const inputClass =
  "mt-2 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-500 disabled:bg-slate-50 disabled:text-slate-500";

export function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block text-xs font-medium text-slate-600 ${className}`}>
      {label}
      {children}
    </label>
  );
}
