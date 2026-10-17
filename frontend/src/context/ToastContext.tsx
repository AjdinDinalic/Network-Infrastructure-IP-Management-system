import { createContext, useCallback, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

interface ToastApi {
  notify: (message: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const timer = useRef<number>(undefined);

  const notify = useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(""), 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      {message && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm text-white shadow-xl">
          <span className="grid size-5 place-items-center rounded-full bg-emerald-500"><Icon name="check" className="size-3" /></span>
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
