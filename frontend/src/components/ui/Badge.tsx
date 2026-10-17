import type { ReactNode } from "react";

const TONES = {
  success: { pill: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
  warning: { pill: "bg-amber-50 text-amber-700", dot: "bg-amber-500" },
  danger: { pill: "bg-rose-50 text-rose-700", dot: "bg-rose-500" },
} as const;

export type Tone = keyof typeof TONES;

export function Badge({ tone, dot = false, children }: { tone: Tone; dot?: boolean; children: ReactNode }) {
  const { pill, dot: dotColor } = TONES[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${pill}`}>
      {dot && <span className={`size-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
}
