import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface TooltipProps {
  /** Tooltip text. */
  content: string;
  children: ReactNode;
  className?: string;
  /**
   * Screen readers already get the info via aria-label/sr-only text on the
   * trigger, so the bubble itself is aria-hidden to avoid double-announcing.
   */
}

/**
 * Lightweight CSS-only tooltip: appears on hover and on keyboard focus
 * (group-focus-within), small delay so it doesn't flicker on pass-over.
 * Named group (group/tt) so it never clashes with parent `group` scopes.
 */
export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn('group/tt relative inline-flex', className)}>
      {children}
      <span
        aria-hidden
        role="presentation"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 translate-y-0.5 whitespace-nowrap rounded-md bg-content px-2 py-1 text-xs font-medium text-surface opacity-0 shadow-card-hover transition-all delay-200 duration-150 group-focus-within/tt:translate-y-0 group-focus-within/tt:opacity-100 group-hover/tt:translate-y-0 group-hover/tt:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
