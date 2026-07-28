import { useEffect, useRef } from 'react';
import { animate, useInView, useMotionValue, useTransform, motion } from 'framer-motion';
import { Circle, CircleCheck, CircleDotDashed, ListTodo } from 'lucide-react';
import type { StatusCounts } from '@/hooks/useFilteredTasks';

interface SummaryBarProps {
  counts: StatusCounts;
}

const cards = [
  { key: 'all', label: 'Total tasks', icon: ListTodo, accent: 'text-brand bg-brand/10' },
  { key: 'pending', label: 'Pending', icon: Circle, accent: 'text-status-pending bg-status-pending/10' },
  { key: 'in-progress', label: 'In Progress', icon: CircleDotDashed, accent: 'text-status-progress bg-status-progress/10' },
  { key: 'completed', label: 'Completed', icon: CircleCheck, accent: 'text-status-completed bg-status-completed/10' },
] as const;

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, { duration: 0.5, ease: 'easeOut' });
    return controls.stop;
  }, [value, inView, motionValue]);

  return (
    <motion.span ref={ref} aria-hidden>
      {rounded}
    </motion.span>
  );
}

/** Spec requirement: per-status counts at the top of the dashboard. */
export function SummaryBar({ counts }: SummaryBarProps) {
  return (
    <section aria-label="Task summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map(({ key, label, icon: Icon, accent }, index) => (
        <motion.div
          key={key}
          className="card flex items-center gap-3 p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06, type: 'spring', duration: 0.4, bounce: 0.15 }}
        >
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${accent}`}>
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-bold leading-tight tabular-nums">
              <AnimatedNumber value={counts[key]} />
              <span className="sr-only">
                {counts[key]} {label.toLowerCase()}
              </span>
            </p>
            <p className="truncate text-xs font-medium text-content-muted">{label}</p>
          </div>
        </motion.div>
      ))}
    </section>
  );
}
