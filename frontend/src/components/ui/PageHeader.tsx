import { useAlerts } from "@/hooks/useAlerts";

export function PageHeader({ title, description }: { title: string; description: string }) {
  const { data: openAlerts } = useAlerts("OPEN");
  const count = openAlerts?.length ?? 0;
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <div className="mb-1 text-sm font-medium text-cyan-700">Network command center</div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className={`size-2 rounded-full ${count ? "bg-amber-500" : "bg-emerald-500"}`} />
        {count ? `${count} open alert${count > 1 ? "s" : ""}` : "All systems operational"}
      </div>
    </div>
  );
}
