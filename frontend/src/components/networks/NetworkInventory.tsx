import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/States";
import { formatNumber, titleCase } from "@/lib/format";
import type { Network, NetworkStatus } from "@/types";

interface NetworkInventoryProps {
  networks: Network[];
  status: "ALL" | NetworkStatus;
  onStatusChange: (status: "ALL" | NetworkStatus) => void;
  onAdd: () => void;
}

export function NetworkInventory({ networks, status, onStatusChange, onAdd }: NetworkInventoryProps) {
  const navigate = useNavigate();
  const headers = ["Network", "CIDR / VLAN", "Utilization", "Location", "Status", ""];

  return (
    <Card as="section" padded={false} className="mt-5 overflow-hidden shadow-slate-200/40">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Network inventory</h2>
          <p className="mt-1 text-xs text-slate-500">Manage subnets and track address allocations</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as "ALL" | NetworkStatus)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none"
          >
            <option value="ALL">All status</option>
            <option value="HEALTHY">Healthy</option>
            <option value="WARNING">Warning</option>
          </select>
          <Button variant="outline" size="sm" onClick={onAdd}>Add network</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-[0.12em] text-slate-500">
            <tr>{headers.map((h, i) => <th key={i} className="px-5 py-3 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {networks.map((n) => (
              <tr key={n.id} className="group hover:bg-slate-50/80">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-cyan-50 group-hover:text-cyan-700"><Icon name="network" className="size-4" /></div>
                    <div>
                      <div className="text-sm font-medium">{n.name}</div>
                      <div className="mt-0.5 text-xs text-slate-400">{formatNumber(n.usedAddresses)} / {formatNumber(n.totalAddresses)} addresses</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="font-mono text-xs font-medium text-slate-700">{n.cidr}</div>
                  <div className="mt-1 text-xs text-slate-400">VLAN {n.vlanId}</div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <ProgressBar value={n.utilizationPct} className="w-24" />
                    <span className="text-xs font-medium text-slate-600">{n.utilizationPct}%</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">{n.location}</td>
                <td className="px-5 py-4"><Badge dot tone={n.status === "HEALTHY" ? "success" : "warning"}>{titleCase(n.status)}</Badge></td>
                <td className="px-5 py-4">
                  <button onClick={() => navigate(`/ip-addresses?network=${n.id}`)} aria-label={`Open ${n.name} IP matrix`} className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                    <Icon name="chevron" className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!networks.length && <EmptyState>No networks match your search.</EmptyState>}
      </div>
    </Card>
  );
}
