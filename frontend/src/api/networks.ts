import type { CreateNetworkInput, IpRecord, Network, NetworkStatus, OverlapResult } from "@/types";
import { del, get, post, query } from "./client";

export const listNetworks = (params: { q?: string; status?: NetworkStatus }, signal?: AbortSignal) =>
  get<Network[]>(`/networks${query(params)}`, signal);

export const createNetwork = (input: CreateNetworkInput) => post<Network>("/networks", input);

export const checkOverlap = (cidr: string, signal?: AbortSignal) =>
  get<OverlapResult>(`/networks/check-overlap${query({ cidr })}`, signal);

export const listIps = (networkId: number, within: string, signal?: AbortSignal) =>
  get<IpRecord[]>(`/networks/${networkId}/ips${query({ within, limit: 512 })}`, signal);

export const reserveIp = (networkId: number, address: string, hostname?: string) =>
  post<IpRecord>(`/networks/${networkId}/ips/reserve`, { address, hostname });

export const releaseIp = (networkId: number, address: string) =>
  del<void>(`/networks/${networkId}/ips/${address}`);
