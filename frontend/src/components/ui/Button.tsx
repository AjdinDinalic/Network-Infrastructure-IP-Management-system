import type { ButtonHTMLAttributes } from "react";

const VARIANTS = {
  primary: "bg-slate-950 text-white hover:bg-slate-800",
  outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
  accent: "bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400",
  glass: "bg-white/10 text-white hover:bg-white/15",
  danger: "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
} as const;

const SIZES = {
  sm: "rounded-lg px-3 py-2 text-xs font-medium",
  md: "rounded-lg px-4 py-2.5 text-sm font-medium",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
}

export function Button({ variant = "primary", size = "md", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`transition disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
