import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Flag, Search } from 'lucide-react';
import type { SortMode, StatusFilter } from '@/types/task';
import type { StatusCounts } from '@/hooks/useFilteredTasks';
import { useTaskDispatch, useTaskState } from '@/hooks/useTasks';
import { cn } from '@/utils/cn';

/** Status filter is URL state — pills are NavLinks, so filters are shareable. */
const FILTER_ROUTES: { filter: StatusFilter; to: string; label: string }[] = [
  { filter: 'all', to: '/', label: 'All' },
  { filter: 'pending', to: '/pending', label: 'Pending' },
  { filter: 'in-progress', to: '/in-progress', label: 'In Progress' },
  { filter: 'completed', to: '/completed', label: 'Completed' },
];

const SORT_OPTIONS: { value: SortMode; label: string; icon: typeof Flag }[] = [
  { value: 'dueDate-asc', label: 'Due date — earliest first', icon: ArrowUpNarrowWide },
  { value: 'dueDate-desc', label: 'Due date — latest first', icon: ArrowDownNarrowWide },
  { value: 'priority', label: 'Priority — high first', icon: Flag },
];

interface FilterBarProps {
  counts: StatusCounts;
  /** Board view groups by status, so pills and sort are hidden there. */
  showFilters?: boolean;
}

export function FilterBar({ counts, showFilters = true }: FilterBarProps) {
  const { sortMode, searchQuery } = useTaskState();
  const dispatch = useTaskDispatch();

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {showFilters ? (
        <nav aria-label="Filter tasks by status" className="flex flex-wrap items-center gap-1.5">
          {FILTER_ROUTES.map(({ filter, to, label }) => (
            <NavLink key={filter} to={to} end className="relative">
              {({ isActive }) => (
                <span
                  className={cn(
                    'relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-white dark:text-slate-950'
                      : 'text-content-muted hover:text-content'
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-brand"
                      transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
                    />
                  )}
                  {label}
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-xs tabular-nums',
                      isActive ? 'bg-white/20' : 'bg-content/5'
                    )}
                  >
                    {counts[filter]}
                  </span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      ) : (
        <div />
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1 lg:w-56 lg:flex-none">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-muted"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            placeholder="Search tasks…"
            aria-label="Search tasks"
            className="input pl-9"
          />
        </div>

        {showFilters && (
          <>
            <label htmlFor="sort-mode" className="sr-only">
              Sort tasks
            </label>
            <select
              id="sort-mode"
              value={sortMode}
              onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value as SortMode })}
              className="input select-chevron w-auto pr-8"
            >
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    </div>
  );
}
