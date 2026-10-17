import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState } from "@/components/ui/States";
import { CurrentUserProvider } from "@/context/CurrentUserContext";
import { ToastProvider } from "@/context/ToastContext";

const OverviewPage = lazy(() => import("@/pages/OverviewPage"));
const NetworksPage = lazy(() => import("@/pages/NetworksPage"));
const IpAddressesPage = lazy(() => import("@/pages/IpAddressesPage"));
const DevicesPage = lazy(() => import("@/pages/DevicesPage"));
const AutomationPage = lazy(() => import("@/pages/AutomationPage"));
const MonitoringPage = lazy(() => import("@/pages/MonitoringPage"));
const SecurityPage = lazy(() => import("@/pages/SecurityPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CurrentUserProvider>
          <Suspense fallback={<LoadingState />}>
            <Routes>
              <Route element={<AppLayout />}>
                <Route index element={<OverviewPage />} />
                <Route path="networks" element={<NetworksPage />} />
                <Route path="ip-addresses" element={<IpAddressesPage />} />
                <Route path="devices" element={<DevicesPage />} />
                <Route path="automation" element={<AutomationPage />} />
                <Route path="monitoring" element={<MonitoringPage />} />
                <Route path="security" element={<SecurityPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<OverviewPage />} />
              </Route>
            </Routes>
          </Suspense>
        </CurrentUserProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
