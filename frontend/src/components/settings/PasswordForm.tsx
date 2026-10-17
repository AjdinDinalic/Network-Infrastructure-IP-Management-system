import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, inputClass } from "@/components/ui/Field";
import { useToast } from "@/hooks/useToast";

export function PasswordForm() {
  const { notify } = useToast();
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const invalid = !next || next !== confirm || next.length < 8;

  return (
    <Card>
      <h2 className="font-semibold">Change password</h2>
      <p className="mt-1 text-xs text-slate-500">Use at least 8 characters with a number and symbol.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Current password" className="sm:col-span-2"><input type="password" placeholder="Enter current password" className={inputClass} /></Field>
        <Field label="New password"><input value={next} onChange={(e) => setNext(e.target.value)} type="password" placeholder="New password" className={inputClass} /></Field>
        <Field label="Confirm password"><input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" placeholder="Repeat password" className={inputClass} /></Field>
      </div>
      {confirm && next !== confirm && <div className="mt-3 text-xs text-rose-600">Passwords do not match.</div>}
      <Button
        className="mt-5"
        disabled={invalid}
        onClick={() => { notify("Password changes need authentication, which isn't set up yet"); setNext(""); setConfirm(""); }}
      >
        Update password
      </Button>
    </Card>
  );
}
