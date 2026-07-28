import type { SortMode, Task, TaskState, TaskStatus, ViewMode } from '@/types/task';

export type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  /** Soft delete — sets deletedAt so the task moves to the trash. */
  | { type: 'DELETE_TASK'; payload: { id: string } }
  /** Clears deletedAt — used by the undo toast and the trash page. */
  | { type: 'RESTORE_TASK'; payload: { id: string } }
  /** Permanent removal (trash page only). */
  | { type: 'PURGE_TASK'; payload: { id: string } }
  | { type: 'EMPTY_TRASH' }
  | { type: 'SET_STATUS'; payload: { id: string; status: TaskStatus } }
  /** Board: reorder within a column. */
  | { type: 'REORDER_TASKS'; payload: { activeId: string; overId: string } }
  /** Board: move across columns — atomic status change + position. */
  | { type: 'MOVE_TASK'; payload: { id: string; status: TaskStatus; overId?: string } }
  | { type: 'SET_SORT'; payload: SortMode }
  | { type: 'SET_VIEW'; payload: ViewMode }
  | { type: 'SET_SEARCH'; payload: string };
// NOTE: the status *filter* is deliberately not an action — it lives in the URL.

const now = () => new Date().toISOString();

function touch(task: Task): Task {
  return { ...task, updatedAt: now() };
}

/**
 * Reorders `tasks` so that the task `activeId` sits at `overId`'s position
 * in the global order, then re-normalizes `order` to stable integers.
 */
function reorder(tasks: Task[], activeId: string, overId: string): Task[] {
  const sorted = [...tasks].sort((a, b) => a.order - b.order);
  const from = sorted.findIndex((t) => t.id === activeId);
  const to = sorted.findIndex((t) => t.id === overId);
  if (from === -1 || to === -1 || from === to) return tasks;
  const [moved] = sorted.splice(from, 1);
  sorted.splice(to, 0, moved!);
  const rank = new Map(sorted.map((t, i) => [t.id, i]));
  return tasks.map((t) => ({ ...t, order: rank.get(t.id)! }));
}

export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? touch(action.payload) : t)),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? touch({ ...t, deletedAt: now() }) : t
        ),
      };

    case 'RESTORE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? touch({ ...t, deletedAt: null }) : t
        ),
      };

    case 'PURGE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload.id) };

    case 'EMPTY_TRASH':
      return { ...state, tasks: state.tasks.filter((t) => t.deletedAt === null) };

    case 'SET_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? touch({ ...t, status: action.payload.status }) : t
        ),
      };

    case 'REORDER_TASKS':
      return {
        ...state,
        tasks: reorder(state.tasks, action.payload.activeId, action.payload.overId),
      };

    case 'MOVE_TASK': {
      const moved = state.tasks.map((t) =>
        t.id === action.payload.id ? touch({ ...t, status: action.payload.status }) : t
      );
      return {
        ...state,
        tasks: action.payload.overId
          ? reorder(moved, action.payload.id, action.payload.overId)
          : moved,
      };
    }

    case 'SET_SORT':
      return { ...state, sortMode: action.payload };

    case 'SET_VIEW':
      return { ...state, viewMode: action.payload };

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
  }
}
