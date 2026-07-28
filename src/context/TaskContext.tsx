import { createContext, useEffect, useReducer, type Dispatch, type ReactNode } from 'react';
import type { TaskState } from '@/types/task';
import { taskReducer, type TaskAction } from './taskReducer';
import { loadTasks, loadViewMode, saveTasks, saveViewMode } from '@/utils/storage';
import { createSeedTasks } from '@/utils/seedData';

/**
 * State and dispatch are split into two contexts so components that only
 * dispatch (forms, buttons) never re-render on state changes.
 */
export const TaskStateContext = createContext<TaskState | null>(null);
export const TaskDispatchContext = createContext<Dispatch<TaskAction> | null>(null);

function init(): TaskState {
  return {
    tasks: loadTasks() ?? createSeedTasks(),
    sortMode: 'dueDate-asc',
    viewMode: loadViewMode(),
    searchQuery: '',
  };
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, undefined, init);

  useEffect(() => {
    saveTasks(state.tasks);
  }, [state.tasks]);

  useEffect(() => {
    saveViewMode(state.viewMode);
  }, [state.viewMode]);

  return (
    <TaskStateContext.Provider value={state}>
      <TaskDispatchContext.Provider value={dispatch}>{children}</TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}
