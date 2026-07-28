import { Columns3, List } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ViewMode } from '@/types/task';
import { useTaskDispatch, useTaskState } from '@/hooks/useTasks';
import { cn } from '@/utils/cn';

const options: { value: ViewMode; label: string; icon: typeof List }[] = [
  { value: 'list', label: 'List view', icon: List },
  { value: 'board', label: 'Board view', icon: Columns3 },
];

/** List ⇄ Board segmented toggle — persisted via the provider. */
export function ViewToggle() {
  const { viewMode } = useTaskState();
  const dispatch = useTaskDispatch();

  return (
    <div
      role="group"
      aria-label="Switch view"
      className="flex rounded-lg bg-surface-sunken p-0.5 ring-1 ring-inset ring-content-muted/10"
    >
      {options.map(({ value, label, icon: Icon }) => {
        const active = viewMode === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            aria-label={label}
            onClick={() => dispatch({ type: 'SET_VIEW', payload: value })}
            className={cn(
              'relative flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60',
              active ? 'text-content' : 'text-content-muted hover:text-content'
            )}
          >
            {active && (
              <motion.span
                layoutId="view-toggle"
                className="absolute inset-0 rounded-md bg-surface-raised shadow-card"
                transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              />
            )}
            <Icon className="relative z-10 h-4 w-4" aria-hidden />
            <span className="relative z-10 hidden md:inline">{label.replace(' view', '')}</span>
          </button>
        );
      })}
    </div>
  );
}
