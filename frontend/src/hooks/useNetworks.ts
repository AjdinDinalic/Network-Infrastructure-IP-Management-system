import { listNetworks } from "@/api/networks";
import type { NetworkStatus } from "@/types";
import { useAsync } from "./useAsync";
import { useDebounce } from "./useDebounce";

export function useNetworks(q = "", status?: NetworkStatus) {
  const debounced = useDebounce(q, 250);
  return useAsync((signal) => listNetworks({ q: debounced, status }, signal), [debounced, status]);
}
