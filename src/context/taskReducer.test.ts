import { describe, expect, it } from 'vitest';
import { taskReducer } from './taskReducer';
import type { Task, TaskState } from '@/types/task';

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 't1',
    title: 'Test task',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-08-01',
    order: 0,
    deletedAt: null,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    ...overrides,
  };
}

function makeState(tasks: Task[]): TaskState {
  return { tasks, sortMode: 'dueDate-asc', viewMode: 'list', searchQuery: '' };
}

describe('taskReducer', () => {
  it('adds a task', () => {
    const state = taskReducer(makeState([]), { type: 'ADD_TASK', payload: makeTask() });
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]?.title).toBe('Test task');
  });

  it('updates a task and bumps updatedAt', () => {
    const task = makeTask();
    const state = taskReducer(makeState([task]), {
      type: 'UPDATE_TASK',
      payload: { ...task, title: 'Renamed' },
    });
    expect(state.tasks[0]?.title).toBe('Renamed');
    expect(state.tasks[0]?.updatedAt).not.toBe(task.updatedAt);
  });

  it('soft-deletes: task moves to trash, not removed', () => {
    const state = taskReducer(makeState([makeTask()]), {
      type: 'DELETE_TASK',
      payload: { id: 't1' },
    });
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0]?.deletedAt).not.toBeNull();
  });

  it('restores a soft-deleted task', () => {
    const deleted = makeTask({ deletedAt: '2026-07-02T00:00:00.000Z' });
    const state = taskReducer(makeState([deleted]), {
      type: 'RESTORE_TASK',
      payload: { id: 't1' },
    });
    expect(state.tasks[0]?.deletedAt).toBeNull();
  });

  it('purges a task permanently', () => {
    const state = taskReducer(makeState([makeTask()]), {
      type: 'PURGE_TASK',
      payload: { id: 't1' },
    });
    expect(state.tasks).toHaveLength(0);
  });

  it('empties only the trash', () => {
    const active = makeTask({ id: 'a' });
    const trashed = makeTask({ id: 'b', deletedAt: '2026-07-02T00:00:00.000Z' });
    const state = taskReducer(makeState([active, trashed]), { type: 'EMPTY_TRASH' });
    expect(state.tasks.map((t) => t.id)).toEqual(['a']);
  });

  it('changes status via SET_STATUS', () => {
    const state = taskReducer(makeState([makeTask()]), {
      type: 'SET_STATUS',
      payload: { id: 't1', status: 'completed' },
    });
    expect(state.tasks[0]?.status).toBe('completed');
  });

  it('reorders tasks and re-normalizes order', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0 }),
      makeTask({ id: 'b', order: 1 }),
      makeTask({ id: 'c', order: 2 }),
    ];
    const state = taskReducer(makeState(tasks), {
      type: 'REORDER_TASKS',
      payload: { activeId: 'a', overId: 'c' },
    });
    const byOrder = [...state.tasks].sort((x, y) => x.order - y.order).map((t) => t.id);
    expect(byOrder).toEqual(['b', 'c', 'a']);
  });

  it('MOVE_TASK changes status and position atomically', () => {
    const tasks = [
      makeTask({ id: 'a', order: 0, status: 'pending' }),
      makeTask({ id: 'b', order: 1, status: 'in-progress' }),
      makeTask({ id: 'c', order: 2, status: 'in-progress' }),
    ];
    const state = taskReducer(makeState(tasks), {
      type: 'MOVE_TASK',
      payload: { id: 'a', status: 'in-progress', overId: 'c' },
    });
    const moved = state.tasks.find((t) => t.id === 'a');
    expect(moved?.status).toBe('in-progress');
    // arrayMove semantics: the dragged task takes the target's index
    const byOrder = [...state.tasks].sort((x, y) => x.order - y.order).map((t) => t.id);
    expect(byOrder).toEqual(['b', 'c', 'a']);
  });

  it('REORDER is a no-op for unknown ids', () => {
    const tasks = [makeTask({ id: 'a' }), makeTask({ id: 'b', order: 1 })];
    const state = taskReducer(makeState(tasks), {
      type: 'REORDER_TASKS',
      payload: { activeId: 'a', overId: 'nope' },
    });
    expect(state.tasks).toEqual(tasks);
  });
});
