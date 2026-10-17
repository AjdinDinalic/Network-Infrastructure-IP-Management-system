import { useSearchParams } from "react-router-dom";

/** The global search box lives in the URL (?q=) so every page can read it. */
export function useSearchQuery(): [string, (value: string) => void] {
  const [params, setParams] = useSearchParams();
  const setQuery = (value: string) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("q", value);
      else next.delete("q");
      return next;
    }, { replace: true });
  return [params.get("q") ?? "", setQuery];
}
