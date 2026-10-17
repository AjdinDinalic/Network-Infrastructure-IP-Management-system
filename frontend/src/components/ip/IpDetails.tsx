import { Button } from "@/components/ui/Button";
import { timeAgo } from "@/lib/format";
import type { MatrixCell } from "@/lib/ip";
import type { IpRecord } from "@/types";

interface IpDetailsProps {
  cell: MatrixCell;
  record?: IpRecord;
  busy: boolean;
  onReserve: () => void;
  onRelease: () => void;
}

export function IpDetails({ cell, record, busy, onReserve, onRelease }: IpDetailsProps) {
  const assignment =
    record?.assignmentType === "STATIC" ? "Static" : record?.assignmentType === "DHCP" ? "DHCP pool" : record ? "Reserved" : cell.state === "free" ? "Available" : "Not assignable";
  const owner = record?.deviceName ?? record?.hostname;

  return (
    <div className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4 sm:grid-cols-4">
      <div><div className="text-[10px] uppercase text-slate-400">Selected address</div><div className="mt-1 font-mono text-sm font-semibold">{cell.address}</div></div>
      <div><div className="text-[10px] uppercase text-slate-400">Assignment</div><div className="mt-1 text-sm">{assignment}{owner ? ` · ${owner}` : ""}</div></div>
      <div><div className="text-[10px] uppercase text-slate-400">Last seen</div><div className="mt-1 text-sm">{timeAgo(record?.lastSeen)}</div></div>
      {record?.state === "RESERVED" && !record.deviceName ? (
        <Button variant="outline" size="sm" disabled={busy} onClick={onRelease}>Release address</Button>
      ) : (
        <Button size="sm" className="px-4" disabled={busy || cell.state !== "free"} onClick={onReserve}>Reserve address</Button>
      )}
    </div>
  );
}
