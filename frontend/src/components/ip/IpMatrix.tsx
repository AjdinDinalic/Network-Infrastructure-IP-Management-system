import { Card } from "@/components/ui/Card";
import type { CellState, MatrixCell } from "@/lib/ip";

const COLORS: Record<CellState, string> = {
  free: "bg-emerald-300",
  occupied: "bg-cyan-500",
  reserved: "bg-slate-400",
  conflict: "bg-rose-500",
  outside: "bg-slate-100",
};

const LEGEND: [string, string][] = [["Free", "bg-emerald-400"], ["Occupied", "bg-cyan-500"], ["Reserved", "bg-slate-400"], ["Conflict", "bg-rose-500"]];

interface IpMatrixProps {
  title: string;
  cells: MatrixCell[];
  selected: number;
  onSelect: (octet: number) => void;
  toolbar?: React.ReactNode;
  children?: React.ReactNode;
}

export function IpMatrix({ title, cells, selected, onSelect, toolbar, children }: IpMatrixProps) {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Interactive IP matrix</h2>
          <p className="mt-1 text-xs text-slate-500">{title} · Click an address to inspect it.</p>
        </div>
        <div className="flex gap-4 text-xs">
          {LEGEND.map(([label, color]) => (
            <span key={label} className="flex items-center gap-2"><i className={`size-2 rounded-sm ${color}`} />{label}</span>
          ))}
        </div>
      </div>
      {toolbar}
      <div className="mt-6 grid grid-cols-8 gap-1 sm:grid-cols-16">
        {cells.map((cell) => (
          <button
            key={cell.octet}
            disabled={cell.state === "outside"}
            title={`${cell.address} · ${cell.state}`}
            onClick={() => onSelect(cell.octet)}
            className={`aspect-square rounded-sm ${COLORS[cell.state]} text-[0px] ring-offset-2 hover:ring-2 hover:ring-slate-400 disabled:cursor-not-allowed disabled:hover:ring-0 ${selected === cell.octet ? "ring-2 ring-slate-950" : ""}`}
          >
            {cell.octet}
          </button>
        ))}
      </div>
      {children}
    </Card>
  );
}
