"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { themeOrder, themes } from "@/themes/themes";
import type { ThemeName } from "@/themes/theme-types";

type ThemeContextValue = {
  theme: ThemeName;
  setTheme: (value: ThemeName) => void;
  nextTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = "sun-theme";

function applyTheme(theme: ThemeName) {
  const tokens = themes[theme];
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.setProperty("--color-primary", tokens.colors.primary);
  root.style.setProperty("--color-secondary", tokens.colors.secondary);
  root.style.setProperty("--color-accent", tokens.colors.accent);
  root.style.setProperty("--color-background", tokens.colors.background);
  root.style.setProperty("--color-surface", tokens.colors.surface);
  root.style.setProperty("--color-border", tokens.colors.border);
  root.style.setProperty("--color-text", tokens.colors.text);
  root.style.setProperty("--color-muted-text", tokens.colors.mutedText);
  root.style.setProperty("--color-success", tokens.colors.success);
  root.style.setProperty("--color-warning", tokens.colors.warning);
  root.style.setProperty("--color-error", tokens.colors.error);
  root.style.setProperty("--radius", tokens.radius);
  root.style.setProperty("--shadow-card", tokens.cardShadow);
  root.style.setProperty("--shadow-soft", tokens.softShadow);
  root.style.setProperty("--glass-surface", tokens.glass ?? "transparent");
  root.style.setProperty("--glass-blur", tokens.blur ?? "blur(0)");
  root.style.setProperty("--layout-density", tokens.layoutDensity);
  root.style.setProperty("--motion-style", tokens.motionStyle);
  root.style.setProperty("--interaction-style", tokens.interactionStyle);
}

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: ThemeName;
}) {
  const [theme, setThemeState] = useState<ThemeName>(initialTheme ?? "minimalism");

  useEffect(() => {
    const saved = localStorage.getItem(storageKey) as ThemeName | null;
    const url = new URL(window.location.href);
    const storeTheme = url.searchParams.get("theme") as ThemeName | null;
    const resolved =
      storeTheme && themes[storeTheme]
        ? storeTheme
        : saved && themes[saved]
          ? saved
          : initialTheme && themes[initialTheme]
            ? initialTheme
            : "minimalism";
    setThemeState(resolved);
    applyTheme(resolved);
  }, [initialTheme]);

  const setTheme = (value: ThemeName) => {
    localStorage.setItem(storageKey, value);
    setThemeState(value);
    applyTheme(value);
  };

  const nextTheme = () => {
    const i = themeOrder.indexOf(theme);
    const next = themeOrder[(i + 1) % themeOrder.length];
    setTheme(next);
  };

  const value = useMemo(() => ({ theme, setTheme, nextTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeStore() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeStore must be used within ThemeProvider");
  return ctx;
}
