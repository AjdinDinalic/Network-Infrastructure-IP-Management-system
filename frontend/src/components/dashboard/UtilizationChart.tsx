import { Card, CardHeader } from "@/components/ui/Card";
import { shortDate } from "@/lib/format";
import type { SeriesPoint } from "@/types";

interface UtilizationChartProps {
  series: SeriesPoint[];
  totalAddresses: number;
  days: number;
  onDaysChange: (days: number) => void;
}

export function UtilizationChart({ series, totalAddresses, days, onDaysChange }: UtilizationChartProps) {
  const bars = series.map((point) => ({
    ...point,
    pct: totalAddresses ? Math.round((point.used / totalAddresses) * 100) : 0,
  }));
  const labelIndexes = bars.length > 1 ? [0, 1, 2, 3, 4].map((i) => Math.round((i * (bars.length - 1)) / 4)) : [0];

  return (
    <Card className="shadow-slate-200/40">
      <CardHeader
        title="Address space utilization"
        description="Allocated addresses across all networks"
        action={
          <select
            value={days}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none"
          >
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        }
      />
      {bars.length ? (
        <>
          <div className="mt-8 flex h-48 items-end gap-3 sm:gap-5">
            {bars.map((bar) => (
              <div key={bar.capturedDay} title={`${shortDate(bar.capturedDay)} · ${bar.pct}% allocated`} className="group flex h-full flex-1 items-end">
                <div style={{ height: `${Math.max(bar.pct, 2)}%` }} className="w-full rounded-t bg-cyan-100 transition group-hover:bg-cyan-400">
                  <div className="h-[38%] rounded-t bg-cyan-500" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-[10px] font-medium uppercase tracking-wider text-slate-400">
            {labelIndexes.map((i) => <span key={i}>{shortDate(bars[i]!.capturedDay)}</span>)}
          </div>
        </>
      ) : (
        <div className="py-16 text-center text-sm text-slate-500">No utilization history yet.</div>
      )}
    </Card>
  );
}
