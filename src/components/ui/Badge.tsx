import { Circle, CircleCheck, CircleDotDashed } from 'lucide-react';
import { STATUS_LABELS, type TaskStatus } from '@/types/task';
import { cn } from '@/utils/cn';

const statusClass: Record<TaskStatus, string> = {
  pending: 'badge-pending',
  'in-progress': 'badge-progress',
  completed: 'badge-completed',
};

const statusIcon: Record<TaskStatus, typeof Circle> = {
  pending: Circle,
  'in-progress': CircleDotDashed,
  completed: CircleCheck,
};

/** Status badge — icon + text so status is never conveyed by color alone. */
export function StatusBadge({ status, className }: { status: TaskStatus; className?: string }) {
  const Icon = statusIcon[status];
  return (
    <span className={cn(statusClass[status], className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {STATUS_LABELS[status]}
    </span>
  );
}
