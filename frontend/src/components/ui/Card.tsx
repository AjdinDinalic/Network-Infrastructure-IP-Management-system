import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  tone?: "light" | "dark";
  padded?: boolean;
  as?: "section" | "div" | "article" | "aside";
}

export function Card({ tone = "light", padded = true, as: Tag = "section", className = "", ...props }: CardProps) {
  const base = tone === "dark" ? "rounded-xl bg-slate-950 text-white shadow-sm" : "rounded-xl border border-slate-200 bg-white shadow-sm";
  return <Tag className={`${base} ${padded ? "p-5" : ""} ${className}`} {...props} />;
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="font-semibold">{title}</h2>
        {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
