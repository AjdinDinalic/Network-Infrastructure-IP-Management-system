import { Icon } from "./Icon";

interface FeedRowProps {
  tone: "ok" | "bad";
  title: string;
  subtitle: string;
  right: string;
  rightSub: string;
}

export function FeedRow({ tone, title, subtitle, right, rightSub }: FeedRowProps) {
  const bad = tone === "bad";
  return (
    <div className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
      <div className={`grid size-9 place-items-center rounded-lg ${bad ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
        <Icon name={bad ? "alert" : "check"} className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{title}</div>
        <div className="mt-1 truncate text-xs text-slate-500">{subtitle}</div>
      </div>
      <div className="text-right">
        <div className="text-xs font-medium">{right}</div>
        <div className="mt-1 text-xs text-slate-400">{rightSub}</div>
      </div>
    </div>
  );
}
