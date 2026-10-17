import { useState, type FormEvent } from "react";
import { createNetwork } from "@/api/networks";
import { Button } from "@/components/ui/Button";
import { Field, inputClass } from "@/components/ui/Field";
import { useToast } from "@/hooks/useToast";

interface CreateNetworkDialogProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateNetworkDialog({ onClose, onCreated }: CreateNetworkDialogProps) {
  const { notify } = useToast();
  const [form, setForm] = useState({ name: "", cidr: "", vlanId: "", vlanName: "", gateway: "", location: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const created = await createNetwork({
        name: form.name.trim(),
        cidr: form.cidr.trim(),
        vlanId: Number(form.vlanId),
        vlanName: form.vlanName.trim().toUpperCase(),
        gateway: form.gateway.trim() || undefined,
        location: form.location.trim(),
      });
      notify(`${created.name} created`);
      onCreated();
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-950/50 p-4" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Create subnet</h2>
        <p className="mt-1 text-xs text-slate-500">The database rejects ranges that overlap an existing network.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2"><input required value={form.name} onChange={set("name")} className={inputClass} /></Field>
          <Field label="CIDR"><input required value={form.cidr} onChange={set("cidr")} placeholder="10.24.4.0/24" className={`${inputClass} font-mono`} /></Field>
          <Field label="Gateway (optional)"><input value={form.gateway} onChange={set("gateway")} placeholder="10.24.4.1" className={`${inputClass} font-mono`} /></Field>
          <Field label="VLAN ID"><input required type="number" min={1} max={4094} value={form.vlanId} onChange={set("vlanId")} className={inputClass} /></Field>
          <Field label="VLAN name"><input required value={form.vlanName} onChange={set("vlanName")} className={inputClass} /></Field>
          <Field label="Location" className="sm:col-span-2"><input required value={form.location} onChange={set("location")} className={inputClass} /></Field>
        </div>
        {error && <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{error}</div>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create subnet"}</Button>
        </div>
      </form>
    </div>
  );
}
