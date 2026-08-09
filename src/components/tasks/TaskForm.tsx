import { useRef, useState, type FormEvent } from 'react';
import { CalendarDays, Flag } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '@/types/task';
import { PRIORITY_LABELS, STATUS_LABELS, TASK_STATUSES } from '@/types/task';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Select } from '@/components/ui/Select';
import { DESCRIPTION_MAX, hasErrors, validateTask, type TaskFormErrors } from '@/utils/validation';
import { todayISO } from '@/utils/date';
import { cn } from '@/utils/cn';

export interface TaskFormSubmitValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
}

interface TaskFormProps {
  /** When present the form is in edit mode, otherwise it creates. */
  task?: Task;
  /** Preselected status for create mode (board column quick-add). */
  initialStatus?: TaskStatus;
  onSubmit: (values: TaskFormSubmitValues) => void;
  onCancel: () => void;
}

const PRIORITIES: TaskPriority[] = ['high', 'medium', 'low'];

const priorityStyles: Record<TaskPriority, string> = {
  high: 'data-[selected=true]:bg-danger/10 data-[selected=true]:text-danger data-[selected=true]:ring-danger/30',
  medium:
    'data-[selected=true]:bg-status-pending/10 data-[selected=true]:text-status-pending data-[selected=true]:ring-status-pending/30',
  low: 'data-[selected=true]:bg-surface-sunken data-[selected=true]:text-content data-[selected=true]:ring-content-muted/30',
};

/** One reusable form for both add and edit — validation on submit, errors clear on change. */
export function TaskForm({ task, initialStatus, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '');
  const [description, setDescription] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? initialStatus ?? 'pending');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ?? todayISO());
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const titleRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validateTask({ title, description, dueDate });
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      // Focus the first invalid field instead of silently failing.
      if (nextErrors.title) titleRef.current?.focus();
      else if (nextErrors.dueDate) dueDateRef.current?.focus();
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), status, priority, dueDate });
  }

  const clearError = (field: keyof TaskFormErrors) =>
    setErrors((current) => ({ ...current, [field]: undefined }));

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="task-title" className="label">
          Title{' '}
          <span aria-hidden className="text-danger">
            *
          </span>
        </label>
        <input
          ref={titleRef}
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            clearError('title');
          }}
          placeholder="e.g. Prepare sprint demo"
          className={cn('input', errors.title && 'input-error')}
          aria-required="true"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'task-title-error' : undefined}
        />
        {errors.title && (
          <p id="task-title-error" className="field-error">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label htmlFor="task-description" className="label mb-0">
            Description
          </label>
          <span
            className={cn(
              'text-xs tabular-nums text-content-muted',
              description.length > DESCRIPTION_MAX && 'font-semibold text-danger'
            )}
          >
            {description.length}/{DESCRIPTION_MAX}
          </span>
        </div>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            clearError('description');
          }}
          rows={3}
          placeholder="Optional details…"
          className={cn('input resize-none', errors.description && 'input-error')}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'task-description-error' : undefined}
        />
        {errors.description && (
          <p id="task-description-error" className="field-error">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="task-due-date" className="label">
            Due date{' '}
            <span aria-hidden className="text-danger">
              *
            </span>
          </label>
          <div className="relative">
            <input
              ref={dueDateRef}
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                clearError('dueDate');
              }}
              className={cn('input pr-10', errors.dueDate && 'input-error')}
              aria-required="true"
              aria-invalid={Boolean(errors.dueDate)}
              aria-describedby={errors.dueDate ? 'task-due-date-error' : undefined}
            />
            <IconButton
              label="Open calendar"
              className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => {
                const input = dueDateRef.current;
                if (!input) return;
                try {
                  input.showPicker();
                } catch {
                  input.focus(); // showPicker unsupported — focus still opens it via keyboard
                }
              }}
            >
              <CalendarDays className="h-4 w-4" aria-hidden />
            </IconButton>
          </div>
          {errors.dueDate && (
            <p id="task-due-date-error" className="field-error">
              {errors.dueDate}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="task-status" className="label">
            Status
          </label>
          <Select
            id="task-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            {TASK_STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <fieldset>
        <legend className="label">Priority</legend>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Priority">
          {PRIORITIES.map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={priority === value}
              data-selected={priority === value}
              onClick={() => setPriority(value)}
              className={cn(
                'flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-content-muted ring-1 ring-inset ring-content-muted/20 transition-colors hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60',
                priorityStyles[value]
              )}
            >
              <Flag
                className="h-3.5 w-3.5"
                fill={priority === value ? 'currentColor' : 'none'}
                aria-hidden
              />
              {PRIORITY_LABELS[value]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{task ? 'Save changes' : 'Add task'}</Button>
      </div>
    </form>
  );
}
