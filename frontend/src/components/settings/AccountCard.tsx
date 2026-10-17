import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";

export function AccountCard() {
  return (
    <Card tone="dark">
      <Icon name="shield" className="size-6 text-cyan-400" />
      <div className="mt-4 text-sm font-medium">Authentication not configured</div>
      <p className="mt-2 text-xs leading-5 text-slate-400">
        The API currently acts as a single seeded user. Add Spring Security to enable sign-in and two-factor authentication.
      </p>
    </Card>
  );
}
