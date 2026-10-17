import { listAlertRules, listAlerts } from "@/api/operations";
import { useAsync } from "./useAsync";

export const useAlerts = (status?: string) =>
  useAsync((signal) => listAlerts(status, signal), [status], 30_000);

export const useAlertRules = () => useAsync((signal) => listAlertRules(signal), []);
