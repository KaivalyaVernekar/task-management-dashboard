# TaskFlow — Task Management Dashboard

A task management dashboard with two views over one state: a filterable, sortable **list** and a Jira-style **kanban board** with accessible drag & drop. Built with React 18, TypeScript (strict), Tailwind CSS, and the Context API.

**Live demo:** _add your Vercel URL here_

## Features

Everything in the exercise spec — task CRUD with validated forms (title and due date mandatory), status filtering, due-date sorting, per-status summary counts, a responsive modern UI with an add/edit modal, Context-API state management, reusable components, client-side routing between All/Completed views, and localStorage persistence.

Beyond the spec: a kanban board view with drag & drop between status columns (fully keyboard-operable, with screen-reader announcements), task priorities (P1/P2/P3 flags plus priority sort), a trash with soft delete/restore/delete-forever, undo-delete via toast, dark mode with system-preference detection and no flash of wrong theme, search across title and description, overdue indicators with relative due labels ("Due tomorrow", "Overdue by 2 days"), URL-driven filters (`/pending`, `/in-progress`, `/completed` are shareable links), empty states, page transitions, an error boundary, and a 26-test suite including axe-core accessibility checks.

## Getting started

```bash
npm install
npm run dev        # start dev server
npm test           # run the test suite
npm run lint       # eslint, zero warnings allowed
npm run build      # typecheck + production build
```

Deployed on Vercel; `vercel.json` rewrites all routes to `index.html` so deep links work.

## Architecture decisions

**Context API + useReducer over Redux.** The state is one array of tasks plus three UI fields — Redux Toolkit's store/slice machinery would add boilerplate without solving a problem this app has. The reducer pattern (typed discriminated-union actions, pure function, unit-tested without React) demonstrates the same thinking RTK is built on. State and dispatch live in **separate contexts**, so components that only dispatch (forms, buttons) never re-render on state changes.

**The URL is the filter state.** There is no `SET_FILTER` action. One dynamic route (`/:status?`) serves all four status views through a single `TasksPage`; the filter pills are `NavLink`s. Filters become shareable, bookmarkable, and back-button friendly — and one piece of state that can't drift out of sync. Unknown segments (`/banana`) render a real 404 rather than silently falling back.

**Views are projections of one state.** The list and the board render the same `TaskCard`, the same `TaskForm`, the same context. The toggle swaps only the container. Features live where they're natural: filtering and sorting in the list (where the spec asks for them), drag-to-change-status and drag-to-reprioritize on the board (where columns make them meaningful). Columns are **derived by filtering on one global `order` field** — never stored per column, so there's a single source of truth for ordering.

**Soft delete.** `DELETE_TASK` sets `deletedAt` instead of removing. This makes the undo toast trivial (restore = clear the field), gives the trash page restore/delete-forever/empty-trash for free, and means every view simply filters `deletedAt === null` at the top of one memoized pipeline.

**Persistence is an implementation detail.** The provider only calls `loadTasks()`/`saveTasks()` from `utils/storage.ts`, which validates at runtime and falls back gracefully (corrupt JSON, private mode, quota). localStorage fits this data size and its sync API suits reducer lazy-init; swapping to IndexedDB or a real API changes one file.

**Token-based design system.** Colors are CSS variables (RGB triplets, so Tailwind opacity modifiers work) mapped to semantic Tailwind names — components say `bg-surface-raised text-content`, never a raw hex. Dark mode swaps at the token layer, so there are **zero `dark:` prefixes in components**; an inline head script resolves the theme before first paint. `@apply` is reserved for true primitives repeated 3+ times (`.btn-*`, `.card`, `.badge-*`, `.input`); component variants are resolved in TSX with a `cn()` helper (clsx + tailwind-merge).

**Drag & drop: dnd-kit.** Chosen over Framer Motion's `Reorder` for multi-container support and built-in accessibility: keyboard sensor (Space to grab, arrows to move across positions and columns) and live-region announcements. Cross-column moves dispatch a single atomic `MOVE_TASK` (status + position) — applied live in `onDragOver` so the target column opens a slot while dragging. The `DragOverlay` card gets the Trello-style lift and tilt.

## Accessibility (WCAG 2.1 AA target)

Semantic landmarks and heading hierarchy; skip-to-content link; every interactive element keyboard-reachable with visible focus rings; modal with focus trap, Esc close, and focus return; status and priority conveyed by icon + text, never color alone; form errors wired via `aria-invalid`/`aria-describedby` with the first invalid field focused on submit; toasts in an `aria-live` region; drag & drop fully keyboard-operable with screen-reader narration; `prefers-reduced-motion` honored by both Framer Motion (`MotionConfig reducedMotion="user"`) and a CSS fallback; axe-core tests assert zero violations on the dashboard and trash pages.

## Testing

`vitest` + Testing Library, 26 tests: reducer unit tests (CRUD, soft delete/restore/purge, reorder and cross-column move semantics), validation unit tests, app smoke tests through the real router, an end-to-end user journey (add with validation errors → edit → delete → undo path via trash → restore), URL-filter navigation, and axe-core accessibility checks.

## Project structure

```
src/
├── context/        # taskReducer (pure), split state/dispatch contexts, provider
├── hooks/          # useTasks, useFilteredTasks (derived-data pipeline), useTheme, useToast
├── components/
│   ├── ui/         # generic primitives: Button, Badge, Modal, Toast, EmptyState
│   ├── layout/     # Navbar, Layout, ErrorBoundary
│   ├── tasks/      # TaskCard, TaskForm, TaskModal, TaskList, DeleteDialog
│   ├── board/      # BoardView (DndContext), BoardColumn, SortableTaskCard
│   ├── dashboard/  # SummaryBar with animated counts
│   └── filters/    # FilterBar (URL-driven pills), ViewToggle
├── pages/          # TasksPage (/:status?), TrashPage, NotFoundPage
├── utils/          # storage abstraction, validation, date helpers, cn, seed data
└── types/          # Task domain types
```
