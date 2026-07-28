import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '@/types/task';
import { STATUS_LABELS, TASK_STATUSES } from '@/types/task';
import { useBoardColumns } from '@/hooks/useFilteredTasks';
import { useTaskDispatch } from '@/hooks/useTasks';
import { useToast } from '@/hooks/useToast';
import { BoardColumn } from './BoardColumn';
import { TaskCard } from '@/components/tasks/TaskCard';

interface BoardViewProps {
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAdd: (status: TaskStatus) => void;
}

function isStatus(id: unknown): id is TaskStatus {
  return typeof id === 'string' && (TASK_STATUSES as string[]).includes(id);
}

/**
 * Jira-style kanban: drag between columns to change status, within a column
 * to reprioritize. Fully keyboard-operable (Space to grab, arrows to move).
 */
export function BoardView({ onEdit, onDelete, onAdd }: BoardViewProps) {
  const columns = useBoardColumns();
  const dispatch = useTaskDispatch();
  const showToast = useToast();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    // Distance constraint keeps card buttons clickable.
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findTask = (id: unknown): Task | undefined =>
    TASK_STATUSES.flatMap((s) => columns[s]).find((t) => t.id === id);

  /** Column of whatever we're hovering: a column itself or a card inside one. */
  function overColumn(overId: unknown): TaskStatus | undefined {
    if (isStatus(overId)) return overId;
    return findTask(overId)?.status;
  }

  function handleDragStart({ active }: DragStartEvent) {
    setActiveTask(findTask(active.id) ?? null);
  }

  /** Cross-column moves happen live so the target column opens a slot. */
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const task = findTask(active.id);
    const target = overColumn(over.id);
    if (!task || !target || task.status === target) return;
    dispatch({
      type: 'MOVE_TASK',
      payload: {
        id: task.id,
        status: target,
        overId: isStatus(over.id) ? undefined : String(over.id),
      },
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveTask(null);
    if (!over) return;
    const task = findTask(active.id);
    if (!task) return;

    // Same-column reorder (cross-column already applied in onDragOver).
    if (!isStatus(over.id) && active.id !== over.id) {
      dispatch({
        type: 'REORDER_TASKS',
        payload: { activeId: String(active.id), overId: String(over.id) },
      });
    }

    const finalColumn = overColumn(over.id);
    if (finalColumn && activeTask && activeTask.status !== finalColumn) {
      showToast({ message: `Moved to ${STATUS_LABELS[finalColumn]}`, variant: 'info' });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
      accessibility={{
        announcements: {
          onDragStart: ({ active }) => `Picked up task ${findTask(active.id)?.title ?? ''}`,
          onDragOver: ({ over }) => {
            const column = overColumn(over?.id);
            return column ? `Task is over the ${STATUS_LABELS[column]} column` : undefined;
          },
          onDragEnd: ({ over }) => {
            const column = overColumn(over?.id);
            return column ? `Task dropped in the ${STATUS_LABELS[column]} column` : 'Task dropped';
          },
          onDragCancel: () => 'Dragging cancelled',
        },
        screenReaderInstructions: {
          draggable:
            'To pick up a task, press space or enter. Use the arrow keys to move it between positions and columns. Press space or enter again to drop, or escape to cancel.',
        },
      }}
    >
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
        {TASK_STATUSES.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={columns[status]}
            onEdit={onEdit}
            onDelete={onDelete}
            onAdd={onAdd}
          />
        ))}
      </div>

      {/* Dragged card follows the pointer — Trello-style lift and tilt. */}
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.2, 0, 0, 1)' }}>
        {activeTask && (
          <div className="rotate-2 scale-105 cursor-grabbing [&>article]:shadow-lifted">
            <TaskCard task={activeTask} onEdit={onEdit} onDelete={onDelete} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
