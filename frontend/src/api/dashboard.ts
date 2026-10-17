import type { Dashboard } from "@/types";
import { get, query } from "./client";

export const getDashboard = (days: number, signal?: AbortSignal) =>
  get<Dashboard>(`/dashboard${query({ days })}`, signal);
