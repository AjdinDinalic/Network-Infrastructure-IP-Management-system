import { useState } from "react";
import { CreateNetworkDialog } from "@/components/networks/CreateNetworkDialog";
import { SubnetCalculator } from "@/components/networks/SubnetCalculator";
import { SubnetInventory } from "@/components/networks/SubnetInventory";
import { PageHeader } from "@/components/ui/PageHeader";
import { QueryBoundary } from "@/components/ui/States";
import { useNetworks } from "@/hooks/useNetworks";
import { useSearchQuery } from "@/hooks/useSearchQuery";

export default function NetworksPage() {
  const [q] = useSearchQuery();
  const networks = useNetworks(q);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <PageHeader title="Networks" description="Manage, automate, and audit your network infrastructure from one workspace." />
      <div className="grid gap-5 xl:grid-cols-[1fr_1.25fr]">
        <SubnetCalculator />
        <QueryBoundary query={networks}>
          {(items) => <SubnetInventory networks={items} onCreate={() => setCreating(true)} />}
        </QueryBoundary>
      </div>
      {creating && <CreateNetworkDialog onClose={() => setCreating(false)} onCreated={networks.refetch} />}
    </>
  );
}
