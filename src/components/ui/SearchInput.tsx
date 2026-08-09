import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { IconButton } from './IconButton';
import { cn } from '@/utils/cn';

interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'onChange'
> {
  value: string;
  onValueChange: (value: string) => void;
  /** Wrapper class (width/layout); the input itself is styled internally. */
  className?: string;
}

/**
 * Search field with leading icon and a themed clear button (the native
 * WebKit cancel button is hidden globally — OS chrome, not themeable).
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onValueChange, className, ...props }, ref) => (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted"
        aria-hidden
      />
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="input pl-9 pr-9"
        {...props}
      />
      {value && (
        <IconButton
          label="Clear search"
          className="absolute right-1.5 top-1/2 h-6 w-6 -translate-y-1/2"
          onClick={() => onValueChange('')}
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </IconButton>
      )}
    </div>
  )
);
SearchInput.displayName = 'SearchInput';
