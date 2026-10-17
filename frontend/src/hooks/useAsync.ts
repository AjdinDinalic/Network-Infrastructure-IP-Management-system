import { useEffect, useState, type DependencyList } from "react";

export interface AsyncState<T> {
  data?: T;
  error?: Error;
  loading: boolean;
  refetch: () => void;
}

/**
 * Runs an async loader whenever `deps` change, cancelling the previous request.
 * `refreshMs` re-runs it on an interval without flipping back to the loading state.
 */
export function useAsync<T>(
  load: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList,
  refreshMs?: number,
): AsyncState<T> {
  const [state, setState] = useState<{ data?: T; error?: Error; loading: boolean }>({ loading: true });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!refreshMs) return;
    const timer = window.setInterval(() => setTick((t) => t + 1), refreshMs);
    return () => window.clearInterval(timer);
  }, [refreshMs]);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: s.data === undefined, error: undefined }));
    load(controller.signal)
      .then((data) => setState({ data, loading: false }))
      .catch((error: Error) => {
        if (controller.signal.aborted) return;
        setState((s) => ({ ...s, error, loading: false }));
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { ...state, refetch: () => setTick((t) => t + 1) };
}
