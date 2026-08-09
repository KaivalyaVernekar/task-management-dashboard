import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCheck, Moon, Sun, Trash2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { IconButton } from '@/components/ui/IconButton';
import { cn } from '@/utils/cn';

const links = [
  { to: '/', label: 'All Tasks', end: true },
  { to: '/completed', label: 'Completed', end: false },
  { to: '/trash', label: 'Trash', end: false, icon: Trash2 },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-content-muted/10 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:h-16 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-white dark:text-slate-950">
            <CheckCheck className="h-5 w-5" aria-hidden />
          </span>
          <span className="hidden sm:inline">TaskFlow</span>
        </NavLink>

        <nav aria-label="Primary" className="flex flex-1 items-center gap-1">
          {links.map(({ to, label, end, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className="relative">
              {({ isActive }) => (
                <span
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive ? 'text-content' : 'text-content-muted hover:text-content'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" aria-hidden />}
                  {label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-[9px] h-0.5 rounded-full bg-brand sm:-bottom-[13px]"
                      transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <IconButton
          label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" aria-hidden />
          ) : (
            <Moon className="h-4 w-4" aria-hidden />
          )}
        </IconButton>
      </div>
    </header>
  );
}
