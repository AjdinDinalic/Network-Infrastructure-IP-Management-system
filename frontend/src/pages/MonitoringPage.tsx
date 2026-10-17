import { listHealth } from "@/api/operations";
import { HealthFeed } from "@/components/monitoring/HealthFeed";
import { FeedCard } from "@/components/ui/FeedCard";
import { InfoPanel } from "@/components/ui/InfoPanel";
import { PageHeader } from "@/components/ui/PageHeader";
import { QueryBoundary } from "@/components/ui/States";
import { useAlertRules } from "@/hooks/useAlerts";
import { useAsync } from "@/hooks/useAsync";
import { useToast } from "@/hooks/useToast";

const RULE_KEYS = ["GATEWAY_REACHABILITY", "CAPACITY_THRESHOLD", "ROGUE_IP"];

export default function MonitoringPage() {
  const { notify } = useToast();
  const health = useAsync((signal) => listHealth(signal), [], 30_000);
  const rules = useAlertRules();

  return (
    <>
      <PageHeader title="Monitoring" description="Manage, automate, and audit your network infrastructure from one workspace." />
      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <FeedCard title="Live network health" description="Latest probe per target · refreshes every 30 seconds.">
          <QueryBoundary query={health}>{(checks) => <HealthFeed checks={checks} />}</QueryBoundary>
        </FeedCard>
        <QueryBoundary query={rules}>
          {(all) => (
            <InfoPanel
              icon="activity"
              title="Alert rules"
              body="Email and in-app alerts trigger when gateways go down or subnet capacity exceeds its threshold."
              rules={all.filter((r) => RULE_KEYS.includes(r.key))}
              actionLabel="Configure notifications"
              onAction={() => notify("Open Settings → Notifications to choose what you receive")}
            />
          )}
        </QueryBoundary>
      </div>
    </>
  );
}
