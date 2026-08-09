import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Accessible name — required, so an icon-only button without a label
   * is a compile error, not an a11y audit finding.
   */
  label: string;
}

/** Square icon-only button — the component API over the .icon-btn primitive. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn('icon-btn', className)}
      {...props}
    />
  )
);
IconButton.displayName = 'IconButton';
