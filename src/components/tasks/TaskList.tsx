import { AnimatePresence, motion } from 'framer-motion';
import type { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd?: () => void;
  emptyTitle: string;
  emptyDescription: string;
}

/** Responsive grid with staggered entrance, layout reflow, and exit animations. */
export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onAdd,
  emptyTitle,
  emptyDescription,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={onAdd && <Button onClick={onAdd}>Add a task</Button>}
      />
    );
  }

  return (
    <>
      <h2 className="sr-only">Task list</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Tasks">
      <AnimatePresence mode="popLayout" initial={false}>
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          >
            <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
          </motion.li>
        ))}
        </AnimatePresence>
      </ul>
    </>
  );
}
