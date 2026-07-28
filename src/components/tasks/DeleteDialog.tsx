import type { Task } from '@/types/task';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTaskDispatch } from '@/hooks/useTasks';
import { useToast } from '@/hooks/useToast';

interface DeleteDialogProps {
  task: Task | null;
  onClose: () => void;
}

/** Confirms a (soft) delete; the toast offers a 5-second undo. */
export function DeleteDialog({ task, onClose }: DeleteDialogProps) {
  const dispatch = useTaskDispatch();
  const showToast = useToast();

  function handleDelete() {
    if (!task) return;
    dispatch({ type: 'DELETE_TASK', payload: { id: task.id } });
    showToast({
      message: 'Task moved to trash',
      action: {
        label: 'Undo',
        onClick: () => dispatch({ type: 'RESTORE_TASK', payload: { id: task.id } }),
      },
    });
    onClose();
  }

  return (
    <Modal open={task !== null} onClose={onClose} title="Delete task?">
      <p className="text-sm text-content-muted">
        “{task?.title}” will move to the trash. You can restore it from there at any time.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
