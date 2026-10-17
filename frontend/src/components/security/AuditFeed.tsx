import { FeedRow } from "@/components/ui/FeedRow";
import { timeAgo, titleCase } from "@/lib/format";
import type { AuditEntry } from "@/types";

export function AuditFeed({ entries }: { entries: AuditEntry[] }) {
  if (!entries.length) return <div className="py-8 text-center text-sm text-slate-500">No audit events yet.</div>;
  return (
    <>
      {entries.map((e) => (
        <FeedRow
          key={e.id}
          tone={e.category === "SECURITY" ? "bad" : "ok"}
          title={e.actor}
          subtitle={e.description}
          right={timeAgo(e.createdAt)}
          rightSub={titleCase(e.category)}
        />
      ))}
    </>
  );
}
