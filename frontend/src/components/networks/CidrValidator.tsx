import { useState } from "react";
import { checkOverlap } from "@/api/networks";
import { Field, inputClass } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";

const CIDR_PATTERN = /^\d{1,3}(\.\d{1,3}){3}\/\d{1,2}$/;

export function CidrValidator() {
  const [value, setValue] = useState("");
  const cidr = useDebounce(value.trim(), 350);
  const valid = CIDR_PATTERN.test(cidr);
  const check = useAsync((signal) => (valid ? checkOverlap(cidr, signal) : Promise.resolve(null)), [cidr, valid]);

  let message: { ok: boolean; text: string } | null = null;
  if (value && cidr) {
    if (!valid) message = { ok: false, text: "Use CIDR notation, e.g. 10.24.4.0/24" };
    else if (check.error) message = { ok: false, text: check.error.message };
    else if (check.data) {
      message = check.data.overlaps
        ? { ok: false, text: `Overlap detected with ${check.data.with}` }
        : { ok: true, text: "No overlap found. This range is available." };
    }
  }

  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <Field label="Validate a new CIDR">
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="e.g. 10.24.4.0/24" className={`${inputClass} font-mono`} />
      </Field>
      {message && (
        <div className={`mt-3 flex items-center gap-2 rounded-lg p-3 text-xs ${message.ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
          <Icon name={message.ok ? "check" : "alert"} className="size-4" />
          {message.text}
        </div>
      )}
    </div>
  );
}
