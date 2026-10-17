import { useState } from "react";
import { CapacityPanel } from "@/components/dashboard/CapacityPanel";
import { StatCard } from "@/components/dashboard/StatCard";
import { UtilizationChart } from "@/components/dashboard/UtilizationChart";
import { CreateNetworkDialog } from "@/components/networks/CreateNetworkDialog";
import { NetworkInventory } from "@/components/networks/NetworkInventory";
import { PageHeader } from "@/components/ui/PageHeader";
import { QueryBoundary } from "@/components/ui/States";
import { useDashboard } from "@/hooks/useDashboard";
import { useNetworks } from "@/hooks/useNetworks";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { formatNumber } from "@/lib/format";
import type { NetworkStatus } from "@/types";

export default function OverviewPage() {
  const [q] = useSearchQuery();
  const [status, setStatus] = useState<"ALL" | NetworkStatus>("ALL");
  const [days, setDays] = useState(30);
  const [creating, setCreating] = useState(false);
  const dashboard = useDashboard(days);
  const networks = useNetworks(q, status === "ALL" ? undefined : status);

  return (
    <>
      <PageHeader title="Infrastructure overview" description="Monitor address space, connectivity, and utilization across your organization." />

      <QueryBoundary query={dashboard}>
        {({ totals, series }) => (
          <>
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total IP addresses" value={formatNumber(totals.totalAddresses)} detail={`${formatNumber(totals.allocatedAddresses)} allocated`} icon="ip" accent="bg-cyan-50 text-cyan-700" />
              <StatCard label="Active networks" value={formatNumber(totals.activeNetworks)} detail={`+${totals.networksAdded30d} this month`} icon="network" accent="bg-indigo-50 text-indigo-700" />
              <StatCard
                label="Online devices"
                value={formatNumber(totals.onlineDevices)}
                detail={totals.totalDevices ? `${((totals.onlineDevices / totals.totalDevices) * 100).toFixed(1)}% availability` : "No devices"}
                icon="devices"
                accent="bg-emerald-50 text-emerald-700"
              />
              <StatCard label="Open alerts" value={formatNumber(totals.openAlerts)} detail={`${totals.criticalAlerts} critical`} icon="alert" accent="bg-amber-50 text-amber-700" />
            </section>
            <section className="mt-5 grid gap-5 xl:grid-cols-[1.7fr_1fr]">
              <UtilizationChart series={series} totalAddresses={totals.totalAddresses} days={days} onDaysChange={setDays} />
              <CapacityPanel data={{ totals, series }} />
            </section>
          </>
        )}
      </QueryBoundary>

      <QueryBoundary query={networks}>
        {(items) => <NetworkInventory networks={items} status={status} onStatusChange={setStatus} onAdd={() => setCreating(true)} />}
      </QueryBoundary>

      {creating && <CreateNetworkDialog onClose={() => setCreating(false)} onCreated={() => { networks.refetch(); dashboard.refetch(); }} />}
    </>
  );
}
