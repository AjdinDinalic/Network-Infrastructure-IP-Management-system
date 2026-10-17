import { Card } from "@/components/ui/Card";
import { Icon, type IconName } from "@/components/ui/Icon";

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  accent: string;
}

export function StatCard({ label, value, detail, icon, accent }: StatCardProps) {
  return (
    <Card as="article" className="shadow-slate-200/40">
      <div className="flex items-start justify-between">
        <div className={`grid size-10 place-items-center rounded-lg ${accent}`}><Icon name={icon} className="size-5" /></div>
        <span className="text-xs font-medium text-slate-400">LIVE</span>
      </div>
      <div className="mt-5 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className="text-slate-500">{label}</span>
        <span className="text-xs text-slate-400">{detail}</span>
      </div>
    </Card>
  );
}
