import type { ReactNode } from "react";
import { Card } from "./Card";

export function FeedCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <span className="flex items-center gap-2 text-xs text-emerald-700"><i className="size-2 animate-pulse rounded-full bg-emerald-500" />Live</span>
      </div>
      <div className="mt-6 space-y-3">{children}</div>
    </Card>
  );
}
