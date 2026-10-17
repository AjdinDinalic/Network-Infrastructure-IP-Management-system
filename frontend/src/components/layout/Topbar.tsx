import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAlerts } from "@/hooks/useAlerts";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { useToast } from "@/hooks/useToast";

export function Topbar({ onMenu, className = "" }: { onMenu: () => void; className?: string }) {
  const navigate = useNavigate();
  const { notify } = useToast();
  const [query, setQuery] = useSearchQuery();
  const { data: open } = useAlerts("OPEN");
  const count = open?.length ?? 0;

  return (
    <header className={`sticky top-0 z-20 flex h-20 items-center border-b border-slate-200 bg-white/95 px-5 backdrop-blur md:px-8 ${className}`}>
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        >
          <Icon name="menu" className="size-5" />
        </button>
        <img src="/favicon.jpg" alt="NIIPM logo" className="size-9 shrink-0 rounded-lg object-cover" />
        <span className="font-semibold">NIIPM</span>
      </div>
      <div className="ml-auto flex items-center gap-3">
        <label className="relative hidden sm:block">
          <Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search networks, IPs..."
            className="h-10 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          />
        </label>
        <button
          onClick={() => (count ? navigate("/monitoring") : notify("You’re all caught up"))}
          aria-label="Alerts"
          className="relative grid size-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
        >
          <Icon name="bell" className="size-[19px]" />
          {count > 0 && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-500 ring-2 ring-white" />}
        </button>
        <Button className="flex h-10 items-center gap-2 px-4 shadow-sm" onClick={() => navigate("/ip-addresses")}>
          <Icon name="plus" className="size-4" /><span className="hidden sm:inline">Allocate IP</span>
        </Button>
      </div>
    </header>
  );
}
