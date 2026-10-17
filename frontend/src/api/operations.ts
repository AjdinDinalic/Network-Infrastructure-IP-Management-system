import type { Alert, AlertRule, AuditEntry, HealthCheck } from "@/types";
import { get, query } from "./client";

export const listAlerts = (status: string | undefined, signal?: AbortSignal) =>
  get<Alert[]>(`/alerts${query({ status })}`, signal);

export const listAlertRules = (signal?: AbortSignal) => get<AlertRule[]>("/alert-rules", signal);

export const listHealth = (signal?: AbortSignal) => get<HealthCheck[]>("/monitoring/health", signal);

export const listAudit = (limit: number, signal?: AbortSignal) =>
  get<AuditEntry[]>(`/audit${query({ limit })}`, signal);
