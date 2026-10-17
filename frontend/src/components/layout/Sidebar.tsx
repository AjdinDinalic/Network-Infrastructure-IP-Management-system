import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { NAV_ITEMS, ROLE_LABELS, SETTINGS_ITEM, type NavItem } from "@/config/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { initials } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

function SidebarLink({ item, dot = false, onNavigate }: { item: NavItem; dot?: boolean; onNavigate?: () => void }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${isActive ? "bg-white/10 font-medium text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon name={item.icon} className={`size-[18px] ${isActive ? "text-cyan-400" : ""}`} />
          {item.label}
          {dot && <span className="ml-auto size-1.5 rounded-full bg-emerald-400" />}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useCurrentUser();
  return (
    <>
      <div className="flex h-20 shrink-0 items-center gap-3 border-b border-white/10 px-6">
       <img src="/favicon.jpg" alt="NIIPM logo" className="size-9 shrink-0 rounded-lg object-cover" />
        <div>
          <div className="text-[15px] font-semibold tracking-tight">NIIPM</div>
          <div className="text-[10px] font-medium tracking-[0.18em] text-slate-400">NETWORK OPS</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-6">
        <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Workspace</div>
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.path} item={item} dot={item.label === "Monitoring"} onNavigate={onNavigate} />
          ))}
        </nav>
      </div>
      <div className="shrink-0 border-t border-white/10 p-3">
        <SidebarLink item={SETTINGS_ITEM} onNavigate={onNavigate} />
        <div className="mt-2 flex items-center gap-3 rounded-lg bg-white/5 p-3">
          <div className="grid size-9 place-items-center rounded-full bg-cyan-100 text-xs font-semibold text-cyan-900">{user ? initials(user.fullName) : "…"}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium">{user?.fullName ?? "Loading…"}</div>
            <div className="truncate text-[11px] text-slate-500">{user ? ROLE_LABELS[user.role] : ""}</div>
          </div>
          <Icon name="dots" className="size-4 text-slate-500" />
        </div>
      </div>
    </>
  );
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-slate-950 text-white lg:flex">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`} inert={!open} aria-hidden={!open}>
        <div onClick={onClose} className={`absolute inset-0 bg-slate-950/50 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`} />
        <aside
          aria-label="Main navigation"
          className={`absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col bg-slate-950 text-white shadow-xl transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <SidebarContent onNavigate={onClose} />
        </aside>
      </div>
    </>
  );
}
