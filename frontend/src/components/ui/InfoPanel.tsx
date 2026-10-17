import type { AlertRule } from "@/types";
import { Button } from "./Button";
import { Card } from "./Card";
import { Icon, type IconName } from "./Icon";

interface InfoPanelProps {
  icon: IconName;
  title: string;
  body: string;
  rules: AlertRule[];
  actionLabel: string;
  onAction: () => void;
}

export function InfoPanel({ icon, title, body, rules, actionLabel, onAction }: InfoPanelProps) {
  return (
    <Card as="aside" tone="dark" className="self-start">
      <Icon name={icon} className="size-6 text-cyan-400" />
      <h2 className="mt-5 font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{body}</p>
      <div className="mt-6 space-y-2">
        {rules.map((rule) => (
          <div key={rule.key} className="flex items-center justify-between rounded-lg bg-white/5 p-3 text-xs">
            <span>{rule.threshold ? `${rule.label} (${rule.threshold}%)` : rule.label}</span>
            <span className={`size-2 rounded-full ${rule.enabled ? "bg-emerald-400" : "bg-slate-500"}`} />
          </div>
        ))}
      </div>
      <Button variant="glass" size="sm" className="mt-6 w-full py-2.5" onClick={onAction}>{actionLabel}</Button>
    </Card>
  );
}
