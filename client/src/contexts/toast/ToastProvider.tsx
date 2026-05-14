import { useCallback, useState, type ReactNode } from "react";
import { ToastContext } from "./ToastContext";
import type { ShowToastInput, Toast, ToastType } from "./ToastTypes";

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, message }: ShowToastInput) => {
      const id = Date.now();

      setToasts((current) => [...current, { id, type, message }]);

      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed right-6 top-6 z-9999 flex w-full max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onClose,
}: {
  toast: Toast;
  onClose: (id: number) => void;
}) {
  const styles: Record<ToastType, string> = {
    success:
      "border-emerald-400/20 bg-emerald-500/10 text-emerald-100 shadow-emerald-950/20",
    error: "border-red-400/20 bg-red-500/10 text-red-100 shadow-red-950/20",
    info: "border-sky-400/20 bg-sky-500/10 text-sky-100 shadow-sky-950/20",
  };

  const dots: Record<ToastType, string> = {
    success: "bg-emerald-300",
    error: "bg-red-300",
    info: "bg-sky-300",
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border px-4 py-4 shadow-2xl backdrop-blur-xl ${styles[toast.type]}`}
    >
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-white/10 blur-2xl" />

      <div className="relative z-10 flex items-start gap-3">
        <div
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${dots[toast.type]}`}
        />

        <p className="flex-1 text-sm font-medium leading-6">{toast.message}</p>

        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="text-white/35 transition-colors hover:text-white/70"
        >
          ×
        </button>
      </div>
    </div>
  );
}
