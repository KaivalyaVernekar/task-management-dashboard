import { useCallback, useEffect, useState } from 'react';
import { THEME_KEY } from '@/utils/storage';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Theme is applied by the inline <head> script before first paint (no FOUC);
 * this hook just toggles the class and persists the choice.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable — theme still applies for the session */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
}
