import { Laptop, Moon, Sun } from 'lucide-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Button } from './button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';

const THEME_MODES = new Set(['light', 'dark', 'auto'] as const);

type ThemeMode = 'light' | 'dark' | 'auto';
type ResolvedTheme = 'light' | 'dark';

const THEME_COLORS = {
  light: '#f9fafb',
  dark: '#101828',
} as const;

const themeKey = 'theme';

const isBrowser = typeof window !== 'undefined';

function getStoredThemeMode(): ThemeMode {
  if (!isBrowser) {
    return 'auto';
  }
  try {
    const stored = localStorage.getItem(themeKey);
    if (stored && THEME_MODES.has(stored as ThemeMode)) {
      return stored as ThemeMode;
    }
  } catch {
    // localStorage unavailable
  }
  return 'auto';
}

function setStoredThemeMode(theme: ThemeMode) {
  if (!isBrowser) {
    return;
  }
  try {
    localStorage.setItem(themeKey, theme);
  } catch {
    // Silently fail
  }
}

function getSystemTheme(): ResolvedTheme {
  if (!isBrowser) {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function updateThemeClass(themeMode: ThemeMode) {
  if (!isBrowser) {
    return;
  }
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
}

function getNextTheme(current: ThemeMode): ThemeMode {
  const themeOrder: ThemeMode[] = getSystemTheme() === 'dark' ? ['auto', 'light', 'dark'] : ['auto', 'dark', 'light'];
  const currentIndex = themeOrder.indexOf(current);
  const nextIndex = (currentIndex + 1) % themeOrder.length;
  return themeOrder[nextIndex];
}

const themeDetectorScript = (() => {
  function themeFn() {
    try {
      const stored = localStorage.getItem('theme') || 'auto';
      const valid = ['light', 'dark', 'auto'].includes(stored) ? stored : 'auto';

      if (valid === 'auto') {
        const auto = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.add(auto, 'auto');
      } else {
        document.documentElement.classList.add(valid);
      }
    } catch {
      const auto = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(auto, 'auto');
    }
  }

  return `(${themeFn.toString()})();`;
})();

function getResolvedThemeFromDOM(): ResolvedTheme {
  if (!isBrowser) {
    return 'light';
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

interface ThemeContextProps {
  resolvedTheme: ResolvedTheme;
  setTheme(theme: ThemeMode): void;
  themeMode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(getResolvedThemeFromDOM);

  useEffect(() => {
    updateThemeClass(themeMode);
    setResolvedTheme(themeMode === 'auto' ? getSystemTheme() : themeMode);

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
    <ThemeContext.Provider value={{ themeMode, resolvedTheme, setTheme, toggleMode }}>{children}</ThemeContext.Provider>
  );
}

export function ThemeScript() {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: Static boot script prevents theme flash before hydration.
    <script dangerouslySetInnerHTML={{ __html: themeDetectorScript }} />
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const handleThemeChange = (theme: ThemeMode) => {
    setTheme(theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label={`Current theme: ${resolvedTheme}. Click to change theme`}
          className="h-8 w-8 cursor-pointer px-0"
          size="sm"
          variant="ghost"
        >
          <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange('light')}>
          <Sun aria-hidden="true" className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
          <Moon aria-hidden="true" className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange('auto')}>
          <Laptop aria-hidden="true" className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
