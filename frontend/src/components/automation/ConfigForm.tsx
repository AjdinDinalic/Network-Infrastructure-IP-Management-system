import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/Field";
import type { Device, Network } from "@/types";

interface ConfigFormProps {
  networks: Network[];
  networkId?: number;
  onNetworkChange: (id: number) => void;
  vlan: string;
  onVlan: (v: string) => void;
  vlanName: string;
  onVlanName: (v: string) => void;
  gateway: string;
  onGateway: (v: string) => void;
  devices: Device[];
  deviceId?: number;
  onDeviceChange: (id: number) => void;
  onQueue: () => void;
  queueing: boolean;
}

export function ConfigForm(p: ConfigFormProps) {
  const device = p.devices.find((d) => d.id === p.deviceId);
  return (
    <Card>
      <h2 className="font-semibold">Cisco configuration generator</h2>
      <p className="mt-1 text-xs text-slate-500">Build a validated IOS configuration from IPAM data.</p>
      <div className="mt-6 space-y-4">
        <Field label="Network">
          <select value={p.networkId ?? ""} onChange={(e) => p.onNetworkChange(Number(e.target.value))} className={inputClass}>
            {p.networks.map((n) => <option key={n.id} value={n.id}>{n.name} · {n.cidr}</option>)}
          </select>
        </Field>
        <Field label="VLAN ID"><input value={p.vlan} onChange={(e) => p.onVlan(e.target.value)} className={inputClass} /></Field>
        <Field label="VLAN name"><input value={p.vlanName} onChange={(e) => p.onVlanName(e.target.value.toUpperCase())} className={inputClass} /></Field>
        <Field label="Gateway IP"><input value={p.gateway} onChange={(e) => p.onGateway(e.target.value)} className={`${inputClass} font-mono`} /></Field>
      </div>
      <div className="mt-6 rounded-lg border border-slate-200 p-4">
        <select value={p.deviceId ?? ""} onChange={(e) => p.onDeviceChange(Number(e.target.value))} className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm">
          {p.devices.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        {device && (
          <div className="mt-3 flex items-center gap-2 text-sm font-medium">
            <span className={`size-2 rounded-full ${device.status === "ONLINE" ? "bg-emerald-500" : "bg-rose-500"}`} />
            {device.name} {device.status === "ONLINE" ? "reachable" : "offline"}
            <span className="ml-auto font-mono text-xs font-normal text-slate-400">{device.ipAddress ?? "no IP"}</span>
          </div>
        )}
        <Button variant="accent" className="mt-4 w-full" disabled={!device || p.queueing} onClick={p.onQueue}>
          {p.queueing ? "Queuing…" : "Queue push to device"}
        </Button>
      </div>
    </Card>
  );
}
