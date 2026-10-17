interface ProgressBarProps {
  value: number;
  /** "tiered" = emerald / cyan / amber by load, "simple" = cyan / amber. */
  scheme?: "tiered" | "simple";
  className?: string;
}

export function ProgressBar({ value, scheme = "simple", className = "" }: ProgressBarProps) {
  const color =
    value > 85 ? "bg-amber-500" : scheme === "tiered" ? (value > 70 ? "bg-cyan-500" : "bg-emerald-500") : "bg-cyan-500";
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div style={{ width: `${Math.min(100, value)}%` }} className={`h-full rounded-full ${color}`} />
    </div>
  );
}
