import { Flag } from 'lucide-react';
import { PRIORITY_LABELS, type TaskPriority } from '@/types/task';
import { cn } from '@/utils/cn';

const priorityClass: Record<TaskPriority, string> = {
  high: 'text-danger',
  medium: 'text-status-pending',
  low: 'text-content-muted',
};

/** Todoist-style priority flag — icon + text label, colorblind-safe. */
export function PriorityFlag({
  priority,
  showLabel = true,
  className,
}: {
  priority: TaskPriority;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium',
        priorityClass[priority],
        className
      )}
    >
      <Flag className="h-3.5 w-3.5" fill="currentColor" aria-hidden />
      {showLabel ? PRIORITY_LABELS[priority] : <span className="sr-only">{PRIORITY_LABELS[priority]} priority</span>}
    </span>
  );
}
