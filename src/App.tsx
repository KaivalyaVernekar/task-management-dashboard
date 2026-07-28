import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { TaskProvider } from '@/context/TaskContext';
import { ToastProvider } from '@/components/ui/Toast';
import { Layout } from '@/components/layout/Layout';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';

const TasksPage = lazy(() => import('@/pages/TasksPage'));
const TrashPage = lazy(() => import('@/pages/TrashPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export default function App() {
  return (
    <ErrorBoundary>
      {/* reducedMotion="user" collapses decorative animation for prefers-reduced-motion */}
      <MotionConfig reducedMotion="user">
        <TaskProvider>
          <ToastProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route
                  path="/trash"
                  element={
                    <Suspense fallback={null}>
                      <TrashPage />
                    </Suspense>
                  }
                />
                {/* One dynamic route: /, /pending, /in-progress, /completed */}
                <Route
                  path="/:status?"
                  element={
                    <Suspense fallback={null}>
                      <TasksPage />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Suspense fallback={null}>
                      <NotFoundPage />
                    </Suspense>
                  }
                />
              </Route>
            </Routes>
          </ToastProvider>
        </TaskProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
