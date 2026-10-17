import { useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { calculateSubnet } from "@/lib/ip";
import { CidrValidator } from "./CidrValidator";

export function SubnetCalculator() {
  const [ip, setIp] = useState("192.168.10.42");
  const [prefix, setPrefix] = useState(24);
  const result = useMemo(() => calculateSubnet(ip, prefix), [ip, prefix]);

  const rows = result && [
    ["Network", result.network], ["Broadcast", result.broadcast], ["Subnet mask", result.mask],
    ["Wildcard", result.wildcard], ["Usable hosts", result.capacity], ["Host range", result.range],
  ];

  return (
    <Card>
      <CardHeader
        title="Subnet & CIDR calculator"
        description="Calculate address boundaries before creating a subnet."
        action={<div className="grid size-10 place-items-center rounded-lg bg-cyan-50 text-cyan-700"><Icon name="network" /></div>}
      />
      <div className="mt-6 grid grid-cols-[1fr_100px] gap-3">
        <Field label="IP address"><input value={ip} onChange={(e) => setIp(e.target.value)} className={`${inputClass} font-mono`} /></Field>
        <Field label="Prefix">
          <select value={prefix} onChange={(e) => setPrefix(Number(e.target.value))} className={inputClass}>
            {Array.from({ length: 25 }, (_, i) => <option key={i} value={i + 8}>/{i + 8}</option>)}
          </select>
        </Field>
      </div>
      {rows ? (
        <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200">
          {rows.map(([label, value]) => (
            <div key={label} className="bg-slate-50 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
              <div className="mt-1 truncate font-mono text-xs text-slate-800">{value}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">Enter a valid IPv4 address.</div>
      )}
      <CidrValidator />
    </Card>
  );
}
