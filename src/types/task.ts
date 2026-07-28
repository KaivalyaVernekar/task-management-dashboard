export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export type TaskPriority = 'high' | 'medium' | 'low';

/** List-view sorting. Manual ordering lives on the board (drag & drop). */
export type SortMode = 'dueDate-asc' | 'dueDate-desc' | 'priority';

export type ViewMode = 'list' | 'board';

/** Status filter — derived from the URL route param, never stored in state. */
export type StatusFilter = TaskStatus | 'all';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  /** ISO date string (yyyy-mm-dd). */
  dueDate: string;
  /** Global manual rank used by board drag & drop. */
  order: number;
  /** Soft delete — non-null means the task is in the trash. */
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskState {
  /** All tasks, including trashed ones. Views filter on `deletedAt`. */
  tasks: Task[];
  sortMode: SortMode;
  viewMode: ViewMode;
  searchQuery: string;
}

export const TASK_STATUSES: TaskStatus[] = ['pending', 'in-progress', 'completed'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

/** Numeric weight for priority sorting (lower = more urgent). */
export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};
