import { isDoneStatus } from '@/types/task';
import type { TaskStatus } from '@/types/task';

const DAY_MS = 24 * 60 * 60 * 1000;

/** Start of today (local time). */
function todayStart(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** Parses a yyyy-mm-dd string as a *local* date (avoids UTC off-by-one). */
export function parseDueDate(dueDate: string): Date {
  const [y, m, d] = dueDate.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function isOverdue(dueDate: string): boolean {
  return parseDueDate(dueDate).getTime() < todayStart();
}

/** "Overdue by 2 days" | "Due today" | "Due tomorrow" | "3 days left" | "Mar 4" */
export function formatDueLabel(dueDate: string): string {
  const diff = Math.round((parseDueDate(dueDate).getTime() - todayStart()) / DAY_MS);
  if (diff < -1) return `Overdue by ${-diff} days`;
  if (diff === -1) return 'Overdue by 1 day';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  if (diff <= 7) return `${diff} days left`;
  return parseDueDate(dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: parseDueDate(dueDate).getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });
}

/** "Jul 26" (year appended when not the current year). Accepts yyyy-mm-dd or full ISO. */
export function formatShortDate(iso: string): string {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? parseDueDate(iso) : new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  });
}

/**
 * Card date label: done tasks are never "overdue" — they show when they
 * were completed (or their original due date for legacy data without
 * completedAt). Shared by the task card and the trash list.
 */
export function taskDateLabel(task: {
  status: TaskStatus;
  dueDate: string;
  completedAt: string | null;
}): string {
  if (!isDoneStatus(task.status)) return formatDueLabel(task.dueDate);
  return task.completedAt
    ? `Completed ${formatShortDate(task.completedAt)}`
    : `Was due ${formatShortDate(task.dueDate)}`;
}

export function formatFullDate(dueDate: string): string {
  return parseDueDate(dueDate).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Today as yyyy-mm-dd for date input min/defaults. */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}
