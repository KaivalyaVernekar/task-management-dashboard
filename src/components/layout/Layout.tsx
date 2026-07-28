import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
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
        <Outlet />
      </main>
    </div>
  );
}
