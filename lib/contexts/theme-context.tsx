'use client';

import { Theme } from '@/hooks/use-dark-mode';
import { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
};

type ThemeContextProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'dark',
});

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: ThemeContextProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme:dark)');

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme === 'dark' ? 'dark' : 'light');
      }
    };

    updateResolvedTheme();

    // if (!document.cookie.includes('theme')) {
    //   const systemTheme = mediaQuery.matches ? 'dark' : 'light';
    //   setTheme(systemTheme);

    //   document.documentElement.className = systemTheme;
    //   document.cookie = `theme=${systemTheme}`;
    // }

    // const handleChange = (e: MediaQueryListEvent) => {
    //   const newTheme = e.matches ? 'dark' : 'light';
    //   setTheme(newTheme);
    //   document.documentElement.className = newTheme;
    //   document.cookie = `theme=${newTheme}`;
    // };

    const handleChange = () => {
      updateResolvedTheme();
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    document.documentElement.className = resolvedTheme;
    document.cookie = `theme=${theme}`;
  }, [resolvedTheme, theme]);

  // const toggleTheme = () => {
  //   const newTheme = theme === 'light' ? 'dark' : 'light';
  //   setTheme(newTheme);
  //   document.documentElement.className = newTheme;
  //   document.cookie = `theme=${newTheme}`;
  // };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
