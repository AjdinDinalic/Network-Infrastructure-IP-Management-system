import { Card } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/useToast";
import type { User } from "@/types";

const OPTIONS = [
  { key: "notifyCapacity", title: "Capacity & health alerts", description: "Gateway failures and subnet capacity warnings" },
  { key: "notifySecurity", title: "Security alerts", description: "Rogue devices, conflicts, and login events" },
] as const;

export function NotificationSettings({ user }: { user: User }) {
  const { save } = useCurrentUser();
  const { notify } = useToast();

  return (
    <Card>
      <h2 className="font-semibold">Notifications</h2>
      <p className="mt-1 text-xs text-slate-500">Choose which updates are sent to your email.</p>
      <div className="mt-5 divide-y divide-slate-100">
        {OPTIONS.map((o) => (
          <div key={o.key} className="flex items-center justify-between gap-4 py-4">
            <div>
              <div className="text-sm font-medium">{o.title}</div>
              <div className="mt-1 text-xs text-slate-500">{o.description}</div>
            </div>
            <Toggle
              label={o.title}
              checked={user[o.key]}
              onChange={(value) =>
                save(o.key === "notifyCapacity" ? { notifyCapacity: value } : { notifySecurity: value }).catch((e: Error) => notify(e.message))
              }
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
