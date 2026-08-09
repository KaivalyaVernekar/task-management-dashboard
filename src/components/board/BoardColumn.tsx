import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { IconButton } from '@/components/ui/IconButton';
import type { Task, TaskStatus } from '@/types/task';
import { STATUS_LABELS } from '@/types/task';
import { SortableTaskCard } from './SortableTaskCard';
import { cn } from '@/utils/cn';

const columnAccent: Record<TaskStatus, string> = {
  pending: 'bg-status-pending',
  'in-progress': 'bg-status-progress',
  completed: 'bg-status-completed',
};

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd: (status: TaskStatus) => void;
}

/** One kanban column: droppable container + sortable list, Jira-style. */
export function BoardColumn({ status, tasks, onEdit, onDelete, onAdd }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      aria-label={`${STATUS_LABELS[status]} column, ${tasks.length} tasks`}
      className={cn(
        'flex w-[85vw] shrink-0 snap-center flex-col rounded-card bg-surface-sunken/60 ring-1 ring-inset ring-content-muted/10 transition-all duration-200 sm:w-auto sm:shrink',
        // Drop-target highlight while a card hovers over the column
        isOver && 'bg-brand/5 ring-2 ring-brand/40'
      )}
    >
      <header className="flex items-center gap-2 px-4 pb-2 pt-4">
        <span className={cn('h-2.5 w-2.5 rounded-full', columnAccent[status])} aria-hidden />
        <h2 className="text-sm font-semibold">{STATUS_LABELS[status]}</h2>
        <span className="rounded-full bg-content/5 px-2 py-0.5 text-xs font-medium tabular-nums text-content-muted">
          {tasks.length}
        </span>
        <IconButton
          label={`Add task to ${STATUS_LABELS[status]}`}
          className="ml-auto h-7 w-7"
          onClick={() => onAdd(status)}
        >
          <Plus className="h-4 w-4" aria-hidden />
        </IconButton>
      </header>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul
          ref={setNodeRef}
          className="flex min-h-[9rem] flex-1 flex-col gap-3 p-3"
          aria-label={`Tasks in ${STATUS_LABELS[status]}`}
        >
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
          ))}
          {tasks.length === 0 && (
            <li className="grid flex-1 place-items-center rounded-xl border-2 border-dashed border-content-muted/15 p-6 text-center text-xs text-content-muted">
              Drop tasks here
            </li>
          )}
        </ul>
      </SortableContext>
    </section>
  );
}
