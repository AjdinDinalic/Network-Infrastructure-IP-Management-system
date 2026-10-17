import { listAudit } from "@/api/operations";
import { AuditFeed } from "@/components/security/AuditFeed";
import { FeedCard } from "@/components/ui/FeedCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { QueryBoundary } from "@/components/ui/States";
import { useAlertRules } from "@/hooks/useAlerts";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/hooks/useToast";

const RULE_KEYS = ["GATEWAY_REACHABILITY", "CAPACITY_THRESHOLD", "CONFIG_CHANGE"];

export default function SecurityPage() {
  const { notify } = useToast();
  const audit = useAsync((signal) => listAudit(50, signal), [], 30_000);
  const rules = useAlertRules();

  return (
    <>
      <PageHeader title="Security" description="Manage, automate, and audit your network infrastructure from one workspace." />
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <FeedCard title="Security & audit log" description="Administrative events and rogue device detection.">
          <QueryBoundary query={audit}>{(entries) => <AuditFeed entries={entries} />}</QueryBoundary>
        </FeedCard>
        <QueryBoundary query={rules}>
          {(all) => (
            <InfoPanel
              icon="shield"
              title="Compliance center"
              body="Every IP, subnet, device, and configuration change is recorded with actor and timestamp."
              rules={all.filter((r) => RULE_KEYS.includes(r.key))}
              actionLabel="Export PDF report"
              onAction={() => notify("PDF export isn't built yet")}
            />
          )}
        </QueryBoundary>
      </div>
    </>
  );
}
