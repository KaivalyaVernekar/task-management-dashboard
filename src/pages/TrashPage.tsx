import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArchiveRestore, Trash2 } from 'lucide-react';
import { useTrashedTasks } from '@/hooks/useFilteredTasks';
import { useTaskDispatch } from '@/hooks/useTasks';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/Badge';
import { formatDueLabel } from '@/utils/date';

export default function TrashPage() {
  const trashed = useTrashedTasks();
  const dispatch = useTaskDispatch();
  const showToast = useToast();

  useEffect(() => {
    document.title = 'Trash — TaskFlow';
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Trash</h1>
          <p className="mt-0.5 text-sm text-content-muted">
            Deleted tasks live here — restore them or remove them permanently.
          </p>
        </div>
        {trashed.length > 0 && (
          <Button
            variant="danger"
            onClick={() => {
              dispatch({ type: 'EMPTY_TRASH' });
              showToast({ message: 'Trash emptied', variant: 'info' });
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Empty trash
          </Button>
        )}
      </div>

      {trashed.length === 0 ? (
        <EmptyState
          title="Trash is empty"
          description="Deleted tasks appear here so you can change your mind."
          icon={<Trash2 className="h-7 w-7" aria-hidden />}
        />
      ) : (
        <ul className="space-y-3" aria-label="Deleted tasks">
          <AnimatePresence initial={false}>
            {trashed.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -24 }}
                className="card flex flex-wrap items-center gap-3 p-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{task.title}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-content-muted">
                    <StatusBadge status={task.status} />
                    <span>{formatDueLabel(task.dueDate)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      dispatch({ type: 'RESTORE_TASK', payload: { id: task.id } });
                      showToast({ message: 'Task restored' });
                    }}
                  >
                    <ArchiveRestore className="h-4 w-4" aria-hidden />
                    Restore
                  </Button>
                  <Button
                    variant="ghost"
                    className="hover:text-danger"
                    onClick={() => dispatch({ type: 'PURGE_TASK', payload: { id: task.id } })}
                    aria-label={`Permanently delete ${task.title}`}
                  >
                    Delete forever
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
