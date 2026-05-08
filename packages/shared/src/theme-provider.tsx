import { ScriptOnce } from '@tanstack/react-router';
import { createClientOnlyFn, createIsomorphicFn } from '@tanstack/react-start';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { z } from 'zod/v4';

const themeModeSchema = z.enum(['light', 'dark', 'auto']);
const resolvedThemeSchema = z.enum(['light', 'dark']);
const themeKey = 'theme';

type ThemeMode = z.infer<typeof themeModeSchema>;
type ResolvedTheme = z.infer<typeof resolvedThemeSchema>;

const THEME_COLORS = {
  light: '#f9fafb', // Tailwind gray-50
  dark: '#101828', // Tailwind gray-900
} as const;

const getStoredThemeMode = createIsomorphicFn()
  .server((): ThemeMode => 'auto')
  .client((): ThemeMode => {
    try {
      const storedTheme = localStorage.getItem(themeKey);
      return themeModeSchema.parse(storedTheme);
    } catch {
      return 'auto';
    }
  });

const setStoredThemeMode = createClientOnlyFn((theme: ThemeMode) => {
  try {
    const parsedTheme = themeModeSchema.parse(theme);
    localStorage.setItem(themeKey, parsedTheme);
  } catch {
    // Silently fail if localStorage is unavailable
  }
});

const getSystemTheme = createIsomorphicFn()
  .server((): ResolvedTheme => 'light')
  .client((): ResolvedTheme => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));

const updateThemeClass = createClientOnlyFn((themeMode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'auto');

  const newTheme = themeMode === 'auto' ? getSystemTheme() : themeMode;
  root.classList.add(newTheme);

  if (themeMode === 'auto') {
    root.classList.add('auto');
  }

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', newTheme === 'dark' ? THEME_COLORS.dark : THEME_COLORS.light);
  }
});

const getNextTheme = createClientOnlyFn((current: ThemeMode): ThemeMode => {
  const themeOrder: ThemeMode[] = getSystemTheme() === 'dark' ? ['auto', 'light', 'dark'] : ['auto', 'dark', 'light'];

  const currentIndex = themeOrder.indexOf(current);
  const nextIndex = (currentIndex + 1) % themeOrder.length;
  return themeOrder[nextIndex];
});

const themeDetectorScript = (() => {
  function themeFn() {
    try {
      const storedTheme = localStorage.getItem('theme') || 'auto';
      const validTheme = ['light', 'dark', 'auto'].includes(storedTheme) ? storedTheme : 'auto';

      if (validTheme === 'auto') {
        const autoTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.add(autoTheme, 'auto');
      } else {
        document.documentElement.classList.add(validTheme);
      }
    } catch (_e) {
      const autoTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(autoTheme, 'auto');
    }
  }

  return `(${themeFn.toString()})();`;
})();

interface ThemeContextProps {
  resolvedTheme: ResolvedTheme;
  setTheme(theme: ThemeMode): void;
  themeMode: ThemeMode;
  toggleMode: () => void;
}
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const getResolvedThemeFromDOM = createIsomorphicFn()
  .server((): ResolvedTheme => 'light')
  .client((): ResolvedTheme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'));

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getResolvedThemeFromDOM);

  // Sync resolved theme with DOM changes (e.g., system theme changes)
  useEffect(() => {
    setResolvedTheme(getResolvedThemeFromDOM());
  }, []);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (themeMode !== 'auto') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      updateThemeClass('auto');
      setResolvedTheme(getSystemTheme());
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themeMode]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    setStoredThemeMode(newTheme);
    updateThemeClass(newTheme);
    setResolvedTheme(newTheme === 'auto' ? getSystemTheme() : newTheme);
  };

  const toggleMode = () => {
    const nextTheme = getNextTheme(themeMode);
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setTheme, toggleMode }}>
      {/** biome-ignore lint/correctness/noChildrenProp: valid */}
      <ScriptOnce children={themeDetectorScript} />
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
