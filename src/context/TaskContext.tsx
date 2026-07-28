import { useEffect, useReducer, type ReactNode } from 'react';
import type { TaskState } from '@/types/task';
import { taskReducer } from './taskReducer';
import { TaskDispatchContext, TaskStateContext } from './taskContexts';
import { loadTasks, loadViewMode, saveTasks, saveViewMode } from '@/utils/storage';
import { createSeedTasks } from '@/utils/seedData';

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
