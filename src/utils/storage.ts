import type { Task, ViewMode } from '@/types/task';

/**
 * Persistence abstraction — the rest of the app never touches localStorage
 * directly. Swapping to IndexedDB or a real API means changing this file only.
 */

const TASKS_KEY = 'taskflow:tasks';
const VIEW_KEY = 'taskflow:view';
export const THEME_KEY = 'taskflow:theme';

export function loadTasks(): Task[] | null {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(isTask);
  } catch {
    // Corrupt JSON, private mode, quota — fall back to seed data.
    return null;
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // Storage unavailable — the app keeps working in-memory.
  }
}

export function loadViewMode(): ViewMode {
  try {
    return localStorage.getItem(VIEW_KEY) === 'board' ? 'board' : 'list';
  } catch {
    return 'list';
  }
}

export function saveViewMode(mode: ViewMode): void {
  try {
    localStorage.setItem(VIEW_KEY, mode);
  } catch {
    /* noop */
  }
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.dueDate === 'string' &&
    ['pending', 'in-progress', 'completed'].includes(t.status as string)
  );
}
