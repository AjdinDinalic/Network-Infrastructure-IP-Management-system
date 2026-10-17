import type { ReactNode } from "react";
import type { AsyncState } from "@/hooks/useAsync";
import { Button } from "./Button";

export const LoadingState = ({ label = "Loading…" }: { label?: string }) => (
  <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500">
    <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-500" />
    {label}
  </div>
);

export const ErrorState = ({ error, onRetry }: { error: Error; onRetry?: () => void }) => (
  <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
    <div className="font-medium">Something went wrong</div>
    <p className="mt-1 text-xs">{error.message}</p>
    {onRetry && <Button variant="danger" size="sm" className="mt-3" onClick={onRetry}>Try again</Button>}
  </div>
);

export const EmptyState = ({ children }: { children: ReactNode }) => (
  <div className="py-12 text-center text-sm text-slate-500">{children}</div>
);

/** Renders loading / error / data states for a useAsync result. */
export function QueryBoundary<T>({ query, children }: { query: AsyncState<T>; children: (data: T) => ReactNode }) {
  if (query.data !== undefined) return <>{children(query.data)}</>;
  if (query.error) return <ErrorState error={query.error} onRetry={query.refetch} />;
  return <LoadingState />;
}
