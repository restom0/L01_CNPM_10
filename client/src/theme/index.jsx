/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "theme";

/**
 * Read saved theme or fall back to system preference.
 *
 * @returns {"light"|"dark"} Theme name.
 */
function getStoredTheme() {
  if (typeof window === "undefined" || !window.localStorage) {
    return "light";
  }
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch {
    /* ignore */
  }
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

/**
 * Apply theme class and browser color scheme to document root.
 *
 * @param {"light"|"dark"} theme - Theme name.
 * @returns {void}
 */
function applyTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

/**
 * Provide theme state and update helpers to app.
 *
 * @param {{children: React.ReactNode}} props - Provider children.
 * @returns {JSX.Element} Theme context provider.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo(() => {
    /**
     * Save next theme to state and localStorage.
     *
     * @param {"light"|"dark"} next - Next theme.
     * @returns {void}
     */
    const updateTheme = (next) => {
      setTheme(next);
      try {
        window.localStorage?.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
    };
    return {
      theme,
      setTheme: updateTheme,
      toggleTheme: () => updateTheme(theme === "dark" ? "light" : "dark"),
    };
  }, [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Access current theme context.
 *
 * @returns {{theme: string, setTheme: Function, toggleTheme: Function}} Theme context.
 */
export function useTheme() {
  return useContext(ThemeContext);
}
