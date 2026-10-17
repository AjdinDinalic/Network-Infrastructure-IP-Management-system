import { getDashboard } from "@/api/dashboard";
import { useAsync } from "./useAsync";

export const useDashboard = (days: number) =>
  useAsync((signal) => getDashboard(days, signal), [days], 60_000);
