import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { formatNumber } from "@/lib/format";
import { useToast } from "@/hooks/useToast";
import type { Dashboard } from "@/types";

export function CapacityPanel({ data }: { data: Dashboard }) {
  const { notify } = useToast();
  const { totalAddresses, allocatedAddresses } = data.totals;
  const pct = totalAddresses ? (allocatedAddresses / totalAddresses) * 100 : 0;
  const first = data.series[0];
  const delta = first && totalAddresses ? pct - (first.used / totalAddresses) * 100 : 0;

  return (
    <Card tone="dark">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">IP capacity</h2>
          <p className="mt-1 text-xs text-slate-400">Organization-wide allocation</p>
        </div>
        <Icon name="activity" className="size-5 text-cyan-400" />
      </div>
      <div className="mt-7 flex items-end justify-between">
        <div className="text-4xl font-semibold tracking-tight">{pct.toFixed(1)}%</div>
        <span className="mb-1 rounded bg-white/10 px-2 py-1 text-xs text-cyan-300">{delta >= 0 ? "+" : ""}{delta.toFixed(1)}%</span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
        <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-cyan-400" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-white/5 p-3"><div className="text-xs text-slate-400">Allocated</div><div className="mt-1 font-semibold">{formatNumber(allocatedAddresses)}</div></div>
        <div className="rounded-lg bg-white/5 p-3"><div className="text-xs text-slate-400">Available</div><div className="mt-1 font-semibold">{formatNumber(totalAddresses - allocatedAddresses)}</div></div>
      </div>
      <button onClick={() => notify("Capacity reports aren't built yet")} className="mt-5 flex items-center gap-2 text-xs font-medium text-cyan-300 hover:text-cyan-200">
        View capacity report <Icon name="arrow" className="size-3.5" />
      </button>
    </Card>
  );
}
