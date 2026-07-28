import { useCallback, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info } from 'lucide-react';
import { ToastContext, type ToastOptions } from './toastContext';

interface ToastItem extends Required<Pick<ToastOptions, 'message' | 'variant'>> {
  id: number;
  action?: ToastOptions['action'];
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    setToasts((current) => [
      ...current.slice(-2), // keep at most 3 visible
      {
        id,
        message: options.message,
        variant: options.variant ?? 'success',
        action: options.action,
      },
    ]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, options.durationMs ?? 5000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {createPortal(
        <div
          aria-live="polite"
          className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-2"
        >
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
                className="card pointer-events-auto flex items-center gap-3 px-4 py-3 text-sm"
              >
                {toast.variant === 'success' ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-status-completed" aria-hidden />
                ) : (
                  <Info className="h-4 w-4 shrink-0 text-status-progress" aria-hidden />
                )}
                <span className="flex-1">{toast.message}</span>
                {toast.action && (
                  <button
                    className="font-semibold text-brand transition-colors hover:text-brand-hover"
                    onClick={() => {
                      toast.action?.onClick();
                      dismiss(toast.id);
                    }}
                  >
                    {toast.action.label}
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
}
