import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';

/** Status filter routes all render TasksPage — one page identity. */
const TASK_ROUTES = ['/', '/pending', '/in-progress', '/completed'];

export function Layout() {
  const { pathname } = useLocation();
  // Animation boundary = conceptual page, not URL string: switching filter
  // pills must not remount TasksPage (would replay all entrance animations).
  const pageKey = TASK_ROUTES.includes(pathname) ? 'tasks' : pathname;

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only-focusable fixed left-4 top-4 z-50 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Entrance-only page transition. Exit animations with <Outlet/> re-resolve
            to the new route inside the exiting clone (page duplication bug), so the
            new page simply fades/slides in on route change. */}
        <motion.div
          key={pageKey}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
