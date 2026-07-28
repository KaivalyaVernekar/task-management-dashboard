import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import type { StatusFilter, Task, TaskStatus } from '@/types/task';
import { STATUS_LABELS } from '@/types/task';
import { useFilteredTasks } from '@/hooks/useFilteredTasks';
import { useTaskState } from '@/hooks/useTasks';
import { SummaryBar } from '@/components/dashboard/SummaryBar';
import { FilterBar } from '@/components/filters/FilterBar';
import { ViewToggle } from '@/components/filters/ViewToggle';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskModal } from '@/components/tasks/TaskModal';
import { DeleteDialog } from '@/components/tasks/DeleteDialog';
import { BoardView } from '@/components/board/BoardView';
import { Button } from '@/components/ui/Button';
import NotFoundPage from './NotFoundPage';

const VALID_FILTERS: StatusFilter[] = ['all', 'pending', 'in-progress', 'completed'];

/**
 * One page for every status view — the URL param IS the filter state
 * (shareable, bookmarkable, back-button friendly).
 */
export default function TasksPage() {
  const { status } = useParams();
  const filter = (status ?? 'all') as StatusFilter;
  const isValid = VALID_FILTERS.includes(filter);

  const { viewMode } = useTaskState();
  const { tasks, counts } = useFilteredTasks(isValid ? filter : 'all');
  const [adding, setAdding] = useState(false);
  const [addStatus, setAddStatus] = useState<TaskStatus | undefined>();
  const [editing, setEditing] = useState<Task | undefined>();
  const [deleting, setDeleting] = useState<Task | null>(null);

  const pageTitle =
    filter === 'all' ? 'All Tasks' : `${STATUS_LABELS[filter as Exclude<StatusFilter, 'all'>]} Tasks`;

  useEffect(() => {
    if (isValid) document.title = `${pageTitle} — TaskFlow`;
  }, [pageTitle, isValid]);

  // Unknown status segment (e.g. /banana) → real 404, no silent fallback.
  if (!isValid) return <NotFoundPage />;

  // Board mode only makes sense across statuses; it lives on "/".
  const showBoard = viewMode === 'board' && filter === 'all';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
          <p className="mt-0.5 text-sm text-content-muted">
            {filter === 'all'
              ? 'Everything on your plate, at a glance.'
              : `Tasks currently ${STATUS_LABELS[filter as Exclude<StatusFilter, 'all'>].toLowerCase()}.`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {filter === 'all' && <ViewToggle />}
          <Button onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" aria-hidden />
            Add task
          </Button>
        </div>
      </div>

      <SummaryBar counts={counts} />

      <FilterBar counts={counts} showFilters={!showBoard} />

      {showBoard ? (
        <BoardView
          onEdit={setEditing}
          onDelete={setDeleting}
          onAdd={(status) => {
            setAddStatus(status);
            setAdding(true);
          }}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onEdit={setEditing}
          onDelete={setDeleting}
          onAdd={() => setAdding(true)}
          emptyTitle={
            counts.all === 0 ? 'No tasks yet' : `No ${pageTitle.toLowerCase()} match`
          }
          emptyDescription={
            counts.all === 0
              ? 'Add your first task to get started.'
              : 'Try a different filter or clear the search.'
          }
        />
      )}

      <TaskModal
        open={adding}
        onClose={() => {
          setAdding(false);
          setAddStatus(undefined);
        }}
        initialStatus={addStatus}
      />
      <TaskModal open={Boolean(editing)} onClose={() => setEditing(undefined)} task={editing} />
      <DeleteDialog task={deleting} onClose={() => setDeleting(null)} />
    </div>
  );
}
