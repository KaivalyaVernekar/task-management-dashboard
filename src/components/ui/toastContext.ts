import { createContext } from 'react';

export interface ToastOptions {
  message: string;
  /** Optional action button, e.g. Undo. */
  action?: { label: string; onClick: () => void };
  variant?: 'success' | 'info';
  durationMs?: number;
}

export const ToastContext = createContext<((options: ToastOptions) => void) | null>(null);
