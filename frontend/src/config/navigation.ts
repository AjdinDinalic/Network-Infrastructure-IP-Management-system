import type { IconName } from "@/components/ui/Icon";

export interface NavItem {
  label: string;
  path: string;
  icon: IconName;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", path: "/", icon: "grid" },
  { label: "Networks", path: "/networks", icon: "network" },
  { label: "IP addresses", path: "/ip-addresses", icon: "ip" },
  { label: "Devices", path: "/devices", icon: "devices" },
  { label: "Automation", path: "/automation", icon: "settings" },
  { label: "Monitoring", path: "/monitoring", icon: "activity" },
  { label: "Security", path: "/security", icon: "shield" },
];

export const SETTINGS_ITEM: NavItem = { label: "Settings", path: "/settings", icon: "settings" };

/** Until authentication exists the app acts as this seeded user (matches niipm.default-actor-id on the backend). */
export const CURRENT_USER_ID = 1;

export const ROLE_LABELS = {
  ADMIN: "Network Administrator",
  OPERATOR: "Network Operator",
  VIEWER: "Viewer",
} as const;

export const TIMEZONES = [
  { value: "America/New_York", label: "UTC−05:00 · Eastern Time" },
  { value: "Europe/London", label: "UTC+00:00 · London" },
  { value: "Europe/Berlin", label: "UTC+01:00 · Central Europe" },
];
