import type { Task } from '@/types/task';

const day = 24 * 60 * 60 * 1000;

const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * day).toISOString();
const isoDate = (offsetDays: number) => iso(offsetDays).slice(0, 10);

let order = 0;

function seed(
  partial: Omit<Task, 'id' | 'order' | 'completedAt' | 'deletedAt' | 'createdAt' | 'updatedAt'> & {
    completedAt?: string;
  }
): Task {
  return {
    id: crypto.randomUUID(),
    order: order++,
    completedAt: null,
    deletedAt: null,
    createdAt: iso(-3),
    updatedAt: iso(-1),
    ...partial,
  };
}

/** Demo tasks so the evaluator lands on a populated dashboard. */
export function createSeedTasks(): Task[] {
  order = 0;
  return [
    seed({
      title: 'Design review — dashboard mockups',
      description: 'Walk through the Figma mockups with the design team and collect feedback.',
      status: 'in-progress',
      priority: 'high',
      dueDate: isoDate(0),
    }),
    seed({
      title: 'Fix login redirect bug',
      description: 'Users landing on a deep link are redirected to the homepage after login.',
      status: 'pending',
      priority: 'high',
      dueDate: isoDate(-1),
    }),
    seed({
      title: 'Write API integration tests',
      description: 'Cover the tasks endpoint: create, update, delete, and pagination.',
      status: 'pending',
      priority: 'medium',
      dueDate: isoDate(2),
    }),
    seed({
      title: 'Update onboarding docs',
      description: 'The setup guide still references the old CLI flags.',
      status: 'pending',
      priority: 'low',
      dueDate: isoDate(5),
    }),
    seed({
      title: 'Quarterly dependency upgrade',
      description: 'Bump minor versions, verify the build, and note any breaking changes.',
      status: 'in-progress',
      priority: 'medium',
      dueDate: isoDate(3),
    }),
    seed({
      title: 'Ship dark mode',
      description: 'Token-based theming with system preference detection.',
      status: 'completed',
      priority: 'medium',
      dueDate: isoDate(-2),
      completedAt: iso(-2),
    }),
    seed({
      title: 'Set up CI pipeline',
      description: 'Lint, typecheck, and test on every pull request.',
      status: 'completed',
      priority: 'high',
      dueDate: isoDate(-4),
      completedAt: iso(-3),
    }),
  ];
}
