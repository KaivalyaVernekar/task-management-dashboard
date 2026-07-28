import { useContext } from 'react';
import { TaskDispatchContext, TaskStateContext } from '@/context/TaskContext';

export function useTaskState() {
  const state = useContext(TaskStateContext);
  if (!state) throw new Error('useTaskState must be used within a TaskProvider');
  return state;
}

export function useTaskDispatch() {
  const dispatch = useContext(TaskDispatchContext);
  if (!dispatch) throw new Error('useTaskDispatch must be used within a TaskProvider');
  return dispatch;
}
