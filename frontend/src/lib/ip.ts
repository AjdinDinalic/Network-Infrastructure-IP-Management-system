export function ipToNumber(ip: string): number | null {
  const octets = ip.split(".").map(Number);
  if (octets.length !== 4 || octets.some((v) => !Number.isInteger(v) || v < 0 || v > 255)) return null;
  return octets.reduce((total, v) => total * 256 + v, 0) >>> 0;
}

export function numberToIp(value: number): string {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

const maskOf = (prefix: number) => (prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0);

export interface SubnetInfo {
  network: string;
  broadcast: string;
  mask: string;
  wildcard: string;
  range: string;
  capacity: string;
}

export function calculateSubnet(ip: string, prefix: number): SubnetInfo | null {
  const value = ipToNumber(ip);
  if (value === null || prefix < 0 || prefix > 32) return null;
  const mask = maskOf(prefix);
  const network = (value & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  return {
    network: numberToIp(network),
    broadcast: numberToIp(broadcast),
    mask: numberToIp(mask),
    wildcard: numberToIp(~mask >>> 0),
    range: prefix >= 31 ? "Point-to-point range" : `${numberToIp(network + 1)} – ${numberToIp(broadcast - 1)}`,
    capacity: Math.max(0, 2 ** (32 - prefix) - 2).toLocaleString(),
  };
}

function parseCidr(cidr: string): { base: number; prefix: number } | null {
  const [ip, p] = cidr.split("/");
  const base = ipToNumber(ip ?? "");
  const prefix = Number(p);
  return base === null || !Number.isInteger(prefix) ? null : { base, prefix };
}

/** The /24 blocks of a network, e.g. 10.24.0.0/16 -> 256 blocks (capped) shown one at a time in the IP matrix. */
export function blocksOf(cidr: string): string[] {
  const parsed = parseCidr(cidr);
  if (!parsed) return [];
  const start = ((parsed.base & maskOf(parsed.prefix)) & 0xffffff00) >>> 0;
  const count = parsed.prefix >= 24 ? 1 : Math.min(256, 2 ** (24 - parsed.prefix));
  return Array.from({ length: count }, (_, i) => `${numberToIp(start + i * 256)}/24`);
}

export type CellState = "free" | "occupied" | "reserved" | "conflict" | "outside";

export interface MatrixCell {
  octet: number;
  address: string;
  state: CellState;
}

interface RecordLike {
  address: string;
  state: "OCCUPIED" | "RESERVED" | "CONFLICT";
}

/** Builds the 256 cells of one /24 block from the allocated addresses the API returned. */
export function buildCells(block: string, networkCidr: string, records: RecordLike[]): MatrixCell[] {
  const prefix3 = block.split(".").slice(0, 3).join(".");
  const net = parseCidr(networkCidr);
  const byAddress = new Map(records.map((r) => [r.address, r.state]));
  const mask = net ? maskOf(net.prefix) : 0;
  const first = net ? (net.base & mask) >>> 0 : 0;
  const last = net ? (first | (~mask >>> 0)) >>> 0 : 0;

  return Array.from({ length: 256 }, (_, octet) => {
    const address = `${prefix3}.${octet}`;
    const numeric = ipToNumber(address) ?? 0;
    let state: CellState = "free";
    if (!net || numeric < first || numeric > last) state = "outside";
    else if (net.prefix < 31 && (numeric === first || numeric === last)) state = "reserved";
    else {
      const stored = byAddress.get(address);
      if (stored === "OCCUPIED") state = "occupied";
      else if (stored === "RESERVED") state = "reserved";
      else if (stored === "CONFLICT") state = "conflict";
    }
    return { octet, address, state };
  });
}
