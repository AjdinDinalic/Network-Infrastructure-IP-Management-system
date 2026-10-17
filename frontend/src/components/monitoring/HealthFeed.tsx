import { FeedRow } from "@/components/ui/FeedRow";
import type { HealthCheck } from "@/types";

const STATUS_LABEL = { ONLINE: "Online", OFFLINE: "Offline", ROGUE: "Rogue IP" } as const;

export function HealthFeed({ checks }: { checks: HealthCheck[] }) {
  if (!checks.length) return <div className="py-8 text-center text-sm text-slate-500">No health checks recorded yet.</div>;
  return (
    <>
      {checks.map((c) => (
        <FeedRow
          key={c.targetIp}
          tone={c.status === "ONLINE" ? "ok" : "bad"}
          title={c.label}
          subtitle={c.targetIp}
          right={STATUS_LABEL[c.status]}
          rightSub={c.latencyMs === null ? "Timeout" : `${c.latencyMs} ms`}
        />
      ))}
    </>
  );
}
