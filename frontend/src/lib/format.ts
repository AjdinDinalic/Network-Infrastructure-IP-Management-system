export const formatNumber = (n: number) => n.toLocaleString();

export function timeAgo(iso?: string | null): string {
  if (!iso) return "Never";
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export const titleCase = (value?: string | null) =>
  value ? value.charAt(0) + value.slice(1).toLowerCase().replace(/_/g, " ") : "";

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]!.toUpperCase()).join("");

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "2-digit" });
