import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand">
        <Compass className="h-7 w-7" aria-hidden />
      </div>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-content-muted">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to all tasks
      </Link>
    </div>
  );
}
