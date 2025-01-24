import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export type Theme = 'system' | 'dark' | 'light';

export type ThemeProps = {
  defaultTheme: Theme;
};

const useDarkMode = ({ defaultTheme }: ThemeProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [cookies, setCookie] = useCookies(['theme']);

  useEffect(() => {
    const storedTheme = cookies.theme as Theme;

    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    } else {
      setCookie('theme', theme);
    }
  }, [cookies.theme, setCookie, theme]);

  const setAndSaveTheme = (theme: Theme) => {
    setTheme(theme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    setCookie('theme', theme);
  };
  const toggleTheme = () => {
    setAndSaveTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, toggleTheme };
};

export default useDarkMode;
