import type { ReactNode } from 'react';
import { ClipboardList } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="animate-fade-in-up flex flex-col items-center justify-center rounded-card border-2 border-dashed border-content-muted/20 px-6 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand">
        {icon ?? <ClipboardList className="h-7 w-7" aria-hidden />}
      </div>
      <p className="text-base font-semibold">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-content-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
