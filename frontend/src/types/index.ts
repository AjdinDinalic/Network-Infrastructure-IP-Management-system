export type NetworkStatus = "HEALTHY" | "WARNING";

export interface Network {
  id: number;
  name: string;
  cidr: string;
  vlanId: number;
  vlanName: string;
  gateway: string | null;
  location: string;
  totalAddresses: number;
  usedAddresses: number;
  utilizationPct: number;
  status: NetworkStatus;
}

export interface CreateNetworkInput {
  name: string;
  cidr: string;
  vlanId: number;
  vlanName: string;
  gateway?: string;
  location: string;
}

export interface OverlapResult {
  overlaps: boolean;
  with: string | null;
}

export type IpState = "OCCUPIED" | "RESERVED" | "CONFLICT";

export interface IpRecord {
  address: string;
  state: IpState;
  assignmentType: "STATIC" | "DHCP" | null;
  hostname: string | null;
  deviceName: string | null;
  lastSeen: string | null;
}

export type DeviceStatus = "ONLINE" | "OFFLINE";

export interface Device {
  id: number;
  name: string;
  type: string;
  ipAddress: string | null;
  mac: string | null;
  portName: string | null;
  portMode: string | null;
  vlanId: number | null;
  status: DeviceStatus;
  lastSeen: string | null;
}

export interface Alert {
  id: number;
  type: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
  message: string;
  createdAt: string;
}

export interface AlertRule {
  key: string;
  label: string;
  enabled: boolean;
  threshold: number | null;
}

export interface HealthCheck {
  label: string;
  targetIp: string;
  status: "ONLINE" | "OFFLINE" | "ROGUE";
  latencyMs: number | null;
  checkedAt: string;
}

export interface AuditEntry {
  id: number;
  actor: string;
  category: string;
  action: string;
  description: string;
  createdAt: string;
}

export interface DashboardTotals {
  totalAddresses: number;
  allocatedAddresses: number;
  activeNetworks: number;
  networksAdded30d: number;
  onlineDevices: number;
  totalDevices: number;
  openAlerts: number;
  criticalAlerts: number;
}

export interface SeriesPoint {
  capturedDay: string;
  used: number;
}

export interface Dashboard {
  totals: DashboardTotals;
  series: SeriesPoint[];
}

export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER";

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  timezone: string;
  notifyCapacity: boolean;
  notifySecurity: boolean;
}

export type UserUpdate = Pick<User, "fullName" | "email" | "timezone" | "notifyCapacity" | "notifySecurity">;

export interface ConfigRequest {
  networkId: number;
  vlanId?: number;
  vlanName?: string;
  gateway?: string;
  deviceId?: number;
  interfaceName?: string;
}

export interface ConfigPreview {
  config: string;
  lineCount: number;
}

export interface ConfigJob {
  jobId: number;
  status: string;
}
