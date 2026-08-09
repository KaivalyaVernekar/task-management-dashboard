import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

type Size = 'md' | 'sm';

const sizeClass: Record<Size, string> = {
  /** Form/toolbar select — matches .input styling. */
  md: 'input select-chevron pr-8',
  /** Compact inline select (task card status quick-change). */
  sm: 'select-chevron rounded-md border-0 bg-surface-sunken py-1 pl-2 pr-7 text-xs font-medium text-content focus:outline-none focus:ring-2 focus:ring-brand/50',
};

// Omit the native `size` attribute (row count) — repurposed as a style variant.
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: Size;
}

/** Design-system select: themed chevron and focus styles in one place. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <select ref={ref} className={cn(sizeClass[size], className)} {...props} />
  )
);
Select.displayName = 'Select';
