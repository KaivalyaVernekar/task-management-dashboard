import { createContext, type Dispatch } from 'react';
import type { TaskState } from '@/types/task';
import type { TaskAction } from './taskReducer';

/**
 * State and dispatch are split into two contexts so components that only
 * dispatch (forms, buttons) never re-render on state changes.
 */
export const TaskStateContext = createContext<TaskState | null>(null);
export const TaskDispatchContext = createContext<Dispatch<TaskAction> | null>(null);
