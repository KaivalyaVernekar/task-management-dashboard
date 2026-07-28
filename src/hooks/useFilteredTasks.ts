import { useMemo } from 'react';
import { PRIORITY_WEIGHT, type StatusFilter, type Task, type TaskStatus } from '@/types/task';
import { useTaskState } from './useTasks';

export interface StatusCounts {
  all: number;
  pending: number;
  'in-progress': number;
  completed: number;
}

/**
 * Single derived-data pipeline: active (non-trashed) → status filter (from the
 * URL) → search → sort. Counts are always computed from active tasks so the
 * summary stays correct regardless of the current filter.
 */
export function useFilteredTasks(filter: StatusFilter) {
  const { tasks, sortMode, searchQuery } = useTaskState();

  return useMemo(() => {
    const active = tasks.filter((t) => t.deletedAt === null);

    const counts: StatusCounts = {
      all: active.length,
      pending: 0,
      'in-progress': 0,
      completed: 0,
    };
    for (const t of active) counts[t.status]++;

    const query = searchQuery.trim().toLowerCase();
    let visible = active;
    if (filter !== 'all') visible = visible.filter((t) => t.status === filter);
    if (query) {
      visible = visible.filter(
        (t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
      );
    }

    const sorted = [...visible].sort((a, b) => {
      switch (sortMode) {
        case 'dueDate-asc':
          return a.dueDate.localeCompare(b.dueDate);
        case 'dueDate-desc':
          return b.dueDate.localeCompare(a.dueDate);
        case 'priority':
          return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
      }
    });

    return { tasks: sorted, counts };
  }, [tasks, filter, searchQuery, sortMode]);
}

/** Board projection: active tasks grouped by status, in manual order. */
export function useBoardColumns() {
  const { tasks, searchQuery } = useTaskState();

  return useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const active = tasks
      .filter((t) => t.deletedAt === null)
      .filter(
        (t) =>
          !query ||
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      )
      .sort((a, b) => a.order - b.order);

    const columns: Record<TaskStatus, Task[]> = {
      pending: [],
      'in-progress': [],
      completed: [],
    };
    for (const t of active) columns[t.status].push(t);
    return columns;
  }, [tasks, searchQuery]);
}

/** Trashed tasks, most recently deleted first. */
export function useTrashedTasks() {
  const { tasks } = useTaskState();
  return useMemo(
    () =>
      tasks
        .filter((t) => t.deletedAt !== null)
        .sort((a, b) => (b.deletedAt ?? '').localeCompare(a.deletedAt ?? '')),
    [tasks]
  );
}
