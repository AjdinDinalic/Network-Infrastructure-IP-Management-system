import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const onSettings = useMatch("/settings");
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => closeMenu(), [pathname, closeMenu]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <main className="lg:pl-64">
        
        <Topbar onMenu={() => setMenuOpen(true)} className={onSettings ? "lg:hidden" : ""} />
        <div className="mx-auto max-w-[1500px] p-5 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
