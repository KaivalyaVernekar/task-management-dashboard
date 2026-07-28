import type { Task, TaskStatus } from '@/types/task';
import { Modal } from '@/components/ui/Modal';
import { TaskForm, type TaskFormSubmitValues } from './TaskForm';
import { useTaskDispatch, useTaskState } from '@/hooks/useTasks';
import { useToast } from '@/hooks/useToast';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  /** Editing when set, creating otherwise. */
  task?: Task;
  /** Preselected status for create mode (board column quick-add). */
  initialStatus?: TaskStatus;
}

/** Wires TaskForm to the store: create or update, with toast feedback. */
export function TaskModal({ open, onClose, task, initialStatus }: TaskModalProps) {
  const dispatch = useTaskDispatch();
  const { tasks } = useTaskState();
  const showToast = useToast();

  function handleSubmit(values: TaskFormSubmitValues) {
    if (task) {
      dispatch({ type: 'UPDATE_TASK', payload: { ...task, ...values } });
      showToast({ message: 'Task updated' });
    } else {
      const now = new Date().toISOString();
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: crypto.randomUUID(),
          ...values,
          order: Math.max(0, ...tasks.map((t) => t.order + 1)),
          deletedAt: null,
          createdAt: now,
          updatedAt: now,
        },
      });
      showToast({ message: 'Task added' });
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={task ? 'Edit task' : 'Add task'}>
      <TaskForm
        key={task?.id ?? `new-${initialStatus ?? 'pending'}`}
        task={task}
        initialStatus={initialStatus}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
}
