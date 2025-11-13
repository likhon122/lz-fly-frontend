"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

type ToastType = "success" | "error" | "info" | "warning";

type ToastItem = {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number; // ms; 0 or undefined = persistent
  // runtime fields
  start?: number; // timestamp when timer started
  remaining?: number; // ms remaining when paused
  paused?: boolean;
};

type ToastContextType = {
  toast: (t: {
    title?: string;
    message: string;
    type?: ToastType;
    duration?: number;
  }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, number | NodeJS.Timeout>>({});
  const MAX_TOASTS = 5;

  // tick to update progress bars smoothly (limited re-renders)
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(id);
  }, []);

  const clearTimer = (id: string) => {
    const timers = timersRef.current as any;
    const tid = timers[id];
    if (tid) {
      clearTimeout(tid as any);
      delete timers[id];
    }
  };

  const remove = useCallback((id: string) => {
    clearTimer(id);
    setToasts((s) => s.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      title,
      message,
      type = "info",
      duration = 4000,
    }: {
      title?: string;
      message: string;
      type?: ToastType;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).slice(2, 9);
      const now = Date.now();
      const item: ToastItem = {
        id,
        title,
        message,
        type,
        duration,
        start: now,
        remaining: duration,
        paused: false,
      };

      setToasts((s) => {
        // keep newest first; enforce max stack size by dropping oldest
        const next = [item, ...s];
        if (next.length > MAX_TOASTS) {
          const toRemove = next.pop();
          if (toRemove) clearTimer(toRemove.id);
        }
        return next;
      });

      // setup auto-dismiss timer for non-persistent toasts
      if (duration && duration > 0) {
        const tid = setTimeout(() => remove(id), duration);
        timersRef.current[id] = tid;
      }
    },
    [remove]
  );

  const success = useCallback(
    (message: string, title?: string) =>
      toast({ title, message, type: "success" }),
    [toast]
  );
  const error = useCallback(
    (message: string, title?: string) =>
      toast({ title, message, type: "error" }),
    [toast]
  );
  const info = useCallback(
    (message: string, title?: string) =>
      toast({ title, message, type: "info" }),
    [toast]
  );
  const warning = useCallback(
    (message: string, title?: string) =>
      toast({ title, message, type: "warning" }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      {/* Toast container */}
      <div
        aria-hidden={toasts.length === 0}
        className="fixed z-50 top-6 right-6 flex flex-col gap-3 max-w-sm"
      >
        {toasts.map((t) => {
          const isError = t.type === "error";
          const duration = t.duration ?? 0;
          const start = t.start ?? Date.now();
          const remaining = t.paused
            ? t.remaining ?? duration
            : Math.max(0, (duration || 0) - (Date.now() - start));
          const percent =
            duration > 0
              ? Math.min(
                  100,
                  Math.max(0, ((duration - remaining) / duration) * 100)
                )
              : 0;

          return (
            <div
              key={t.id}
              role={isError ? "alert" : "status"}
              aria-live={isError ? "assertive" : "polite"}
              aria-atomic="true"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Escape") remove(t.id);
              }}
              onFocus={() => {
                // pause
                if (!t.paused && t.duration && t.duration > 0) {
                  clearTimer(t.id);
                  setToasts((s) =>
                    s.map((x) =>
                      x.id === t.id
                        ? {
                            ...x,
                            paused: true,
                            remaining: Math.max(
                              0,
                              (x.duration ?? 0) -
                                (Date.now() - (x.start ?? Date.now()))
                            ),
                          }
                        : x
                    )
                  );
                }
              }}
              onBlur={() => {
                // resume
                const toastObj = toasts.find((x) => x.id === t.id);
                if (
                  toastObj &&
                  toastObj.paused &&
                  (toastObj.remaining ?? 0) > 0
                ) {
                  setToasts((s) =>
                    s.map((x) =>
                      x.id === t.id
                        ? { ...x, paused: false, start: Date.now() }
                        : x
                    )
                  );
                  timersRef.current[t.id] = setTimeout(
                    () => remove(t.id),
                    toastObj.remaining
                  );
                }
              }}
              onMouseEnter={() => {
                if (!t.paused && t.duration && t.duration > 0) {
                  clearTimer(t.id);
                  setToasts((s) =>
                    s.map((x) =>
                      x.id === t.id
                        ? {
                            ...x,
                            paused: true,
                            remaining: Math.max(
                              0,
                              (x.duration ?? 0) -
                                (Date.now() - (x.start ?? Date.now()))
                            ),
                          }
                        : x
                    )
                  );
                }
              }}
              onMouseLeave={() => {
                const toastObj = toasts.find((x) => x.id === t.id);
                if (
                  toastObj &&
                  toastObj.paused &&
                  (toastObj.remaining ?? 0) > 0
                ) {
                  setToasts((s) =>
                    s.map((x) =>
                      x.id === t.id
                        ? { ...x, paused: false, start: Date.now() }
                        : x
                    )
                  );
                  timersRef.current[t.id] = setTimeout(
                    () => remove(t.id),
                    toastObj.remaining
                  );
                }
              }}
              className={`w-full border px-4 py-3 rounded shadow-lg dark:shadow-primary/10 flex items-start gap-3 focus:outline-none transform transition-all duration-200 backdrop-blur-xl ${
                t.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-500/15 dark:border-emerald-500/40"
                  : t.type === "error"
                  ? "bg-red-500/10 border-red-500/30 dark:bg-red-500/15 dark:border-red-500/40"
                  : t.type === "warning"
                  ? "bg-amber-500/10 border-amber-500/30 dark:bg-amber-500/15 dark:border-amber-500/40"
                  : "bg-card/95 dark:bg-[#141414]/90 border-border/80 dark:border-[#1e1e1e]/80"
              }`}
            >
              <div className="flex-1">
                {t.title && (
                  <div className="font-semibold text-sm text-foreground">
                    {t.title}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">{t.message}</div>

                {/* progress bar for non-persistent toasts */}
                {duration > 0 && (
                  <div className="w-full h-1 mt-3 bg-muted/50 dark:bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        t.type === "success"
                          ? "bg-gradient-to-r from-green-500 to-green-400"
                          : t.type === "error"
                          ? "bg-gradient-to-r from-red-500 to-red-400"
                          : t.type === "warning"
                          ? "bg-gradient-to-r from-yellow-500 to-orange-400"
                          : "bg-gradient-to-r from-blue-500 to-green-400"
                      }`}
                      style={{
                        width: `${percent}%`,
                        transitionProperty: "width",
                        transitionDuration: "200ms",
                        transitionTimingFunction: "linear",
                        // respect reduced motion
                        animationPlayState: (t.paused
                          ? "paused"
                          : "running") as any,
                      }}
                    />
                  </div>
                )}
              </div>
              <button
                aria-label="Dismiss notification"
                onClick={() => remove(t.id)}
                className="text-gray-500 hover:text-gray-700 ml-2 p-1 rounded focus:ring-2 focus:ring-offset-1 focus:ring-blue-300"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
