const ZONES = [["Infrastructure", ".1 – .20"], ["Static servers", ".21 – .99"], ["Dynamic DHCP", ".100 – .254"]];

export function AddressPlan() {
  return (
    <div className="mt-5 grid grid-cols-3 gap-2">
      {ZONES.map(([name, range]) => (
        <div key={name} className="rounded-lg border border-slate-200 p-3">
          <div className="text-xs text-slate-500">{name}</div>
          <div className="mt-1 font-mono text-sm">{range}</div>
        </div>
      ))}
    </div>
  );
}
