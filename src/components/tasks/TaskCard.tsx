import { memo } from 'react';
import { CalendarDays, Pencil, Trash2 } from 'lucide-react';
import type { Task, TaskStatus } from '@/types/task';
import { PRIORITY_LABELS, STATUS_LABELS, TASK_STATUSES } from '@/types/task';
import { StatusBadge } from '@/components/ui/Badge';
import { PriorityFlag } from '@/components/ui/PriorityFlag';
import { Tooltip } from '@/components/ui/Tooltip';
import { formatDueLabel, formatFullDate, isOverdue } from '@/utils/date';
import { useTaskDispatch } from '@/hooks/useTasks';
import { cn } from '@/utils/cn';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/**
 * Reusable task card — shared by the list grid and the board columns.
 * Memoized: only re-renders when its own task changes.
 */
export const TaskCard = memo(function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const dispatch = useTaskDispatch();
  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <article
      aria-label={task.title}
      className={cn(
        'card-hover group relative flex h-full flex-col gap-3 p-4',
        task.priority === 'high' && 'border-l-[3px] border-l-danger'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <StatusBadge status={task.status} />
        <div className="flex items-center gap-0.5 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
          <Tooltip content="Edit task">
            <button
              className="icon-btn"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </button>
          </Tooltip>
          <Tooltip content="Delete task">
            <button
              className="icon-btn hover:text-danger"
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="flex-1">
        <h3
          className={cn(
            'font-semibold leading-snug',
            task.status === 'completed' &&
              'text-content-muted line-through decoration-content-muted/50'
          )}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-sm text-content-muted">{task.description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-content-muted/10 pt-3">
        <Tooltip content={formatFullDate(task.dueDate)}>
          <span
            tabIndex={0}
            className={cn(
              'inline-flex items-center gap-1.5 rounded text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50',
              overdue ? 'text-danger' : 'text-content-muted'
            )}
          >
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            {formatDueLabel(task.dueDate)}
            <span className="sr-only">, due {formatFullDate(task.dueDate)}</span>
          </span>
        </Tooltip>
        <div className="flex items-center gap-3">
          <Tooltip content={`${PRIORITY_LABELS[task.priority]} priority`}>
            <PriorityFlag priority={task.priority} showLabel={false} />
          </Tooltip>
          <label className="sr-only" htmlFor={`status-${task.id}`}>
            Change status of {task.title}
          </label>
          <select
            id={`status-${task.id}`}
            value={task.status}
            onChange={(e) =>
              dispatch({
                type: 'SET_STATUS',
                payload: { id: task.id, status: e.target.value as TaskStatus },
              })
            }
            className="select-chevron rounded-md border-0 bg-surface-sunken py-1 pl-2 pr-7 text-xs font-medium text-content focus:outline-none focus:ring-2 focus:ring-brand/50"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </article>
  );
});
