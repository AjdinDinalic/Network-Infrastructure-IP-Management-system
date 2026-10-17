import { listDevices } from "@/api/devices";
import { useAsync } from "./useAsync";

export const useDevices = () => useAsync((signal) => listDevices(signal), []);
