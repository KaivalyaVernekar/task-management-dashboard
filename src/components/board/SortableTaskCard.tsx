import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/types/task';
import { TaskCard } from '@/components/tasks/TaskCard';
import { cn } from '@/utils/cn';

interface SortableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

/**
 * Sortable wrapper around the shared TaskCard. The whole card is the drag
 * handle (pointer sensor uses a distance constraint so buttons still click);
 * keyboard users pick up with Space and move with arrows.
 */
export function SortableTaskCard({ task, onEdit, onDelete }: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { status: task.status },
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'touch-manipulation',
        // Origin slot while dragging: dashed ghost placeholder
        isDragging && 'opacity-40 [&>article]:border-2 [&>article]:border-dashed [&>article]:border-content-muted/30 [&>article]:shadow-none'
      )}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </li>
  );
}
