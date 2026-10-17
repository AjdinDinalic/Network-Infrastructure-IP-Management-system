import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { titleCase } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import type { Device } from "@/types";

const portLabel = (d: Device) => {
  if (!d.portName) return "—";
  const detail = d.portMode === "ACCESS" && d.vlanId ? `VLAN ${d.vlanId}` : titleCase(d.portMode);
  return detail ? `${d.portName} · ${detail}` : d.portName;
};

export function DeviceTable({ devices }: { devices: Device[] }) {
  const { notify } = useToast();
  const headers = ["Device", "Type", "IP address", "MAC address", "Switch port", "Status"];

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        <div>
          <h2 className="font-semibold">Devices & switch ports</h2>
          <p className="mt-1 text-xs text-slate-500">Asset, MAC, VLAN, and physical port inventory.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => notify("CSV import isn't built yet")}>Import CSV / Excel</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
            <tr>{headers.map((h) => <th key={h} className="px-5 py-3">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {devices.map((d) => (
              <tr key={d.id}>
                <td className="px-5 py-4 font-medium">{d.name}</td>
                <td className="px-5 py-4 text-slate-600">{titleCase(d.type)}</td>
                <td className="px-5 py-4 font-mono text-xs text-slate-600">{d.ipAddress ?? "—"}</td>
                <td className="px-5 py-4 font-mono text-xs text-slate-600">{d.mac ?? "—"}</td>
                <td className="px-5 py-4 text-slate-600">{portLabel(d)}</td>
                <td className="px-5 py-4"><Badge tone={d.status === "ONLINE" ? "success" : "danger"}>{titleCase(d.status)}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!devices.length && <EmptyState>No devices have been registered yet.</EmptyState>}
      </div>
    </Card>
  );
}
