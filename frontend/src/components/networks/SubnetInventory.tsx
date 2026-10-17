import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Network } from "@/types";

export function SubnetInventory({ networks, onCreate }: { networks: Network[]; onCreate: () => void }) {
  return (
    <Card>
      <CardHeader
        title="Subnet inventory"
        description="Capacity thresholds and conflict status."
        action={<Button size="sm" onClick={onCreate}>Create subnet</Button>}
      />
      <div className="mt-5 space-y-3">
        {networks.map((n) => (
          <div key={n.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex justify-between">
              <div>
                <div className="text-sm font-medium">{n.name}</div>
                <div className="mt-1 font-mono text-xs text-slate-400">{n.cidr} · VLAN {n.vlanId}</div>
              </div>
              <span className={`text-sm font-semibold ${n.utilizationPct > 85 ? "text-amber-600" : "text-slate-700"}`}>{n.utilizationPct}%</span>
            </div>
            <ProgressBar value={n.utilizationPct} scheme="tiered" className="mt-3" />
          </div>
        ))}
      </div>
    </Card>
  );
}
