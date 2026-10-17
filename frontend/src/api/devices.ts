import type { Device } from "@/types";
import { get } from "./client";

export const listDevices = (signal?: AbortSignal) => get<Device[]>("/devices", signal);
