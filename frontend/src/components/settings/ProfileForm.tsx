import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/Field";
import { ROLE_LABELS, TIMEZONES } from "@/config/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useToast } from "@/hooks/useToast";
import { initials } from "@/lib/format";
import type { User } from "@/types";

export function ProfileForm({ user }: { user: User }) {
  const { save } = useCurrentUser();
  const { notify } = useToast();
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [timezone, setTimezone] = useState(user.timezone);
  const [saving, setSaving] = useState(false);

  async function submit() {
    setSaving(true);
    try {
      await save({ fullName, email, timezone });
      notify("Profile settings saved");
    } catch (error) {
      notify((error as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <div className="grid size-14 place-items-center rounded-full bg-cyan-100 text-base font-semibold text-cyan-900">{initials(fullName || user.fullName)}</div>
        <div>
          <h2 className="font-semibold">User profile</h2>
          <p className="mt-1 text-xs text-slate-500">Update your personal information and preferences.</p>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} /></Field>
        <Field label="Email address"><input value={email} type="email" onChange={(e) => setEmail(e.target.value)} className={inputClass} /></Field>
        <Field label="Role"><input value={ROLE_LABELS[user.role]} disabled className={inputClass} /></Field>
        <Field label="Timezone">
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputClass}>
            {TIMEZONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </Field>
      </div>
      <Button className="mt-5" disabled={saving} onClick={submit}>{saving ? "Saving…" : "Save changes"}</Button>
    </Card>
  );
}
