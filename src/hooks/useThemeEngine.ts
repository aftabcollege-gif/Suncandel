"use client";

import { useMemo } from "react";
import { themes } from "@/themes/themes";
import { useThemeStore } from "@/store/theme-store";

export function useThemeEngine() {
  const { theme, setTheme, nextTheme } = useThemeStore();
  const tokens = useMemo(() => themes[theme], [theme]);
  return { theme, setTheme, nextTheme, tokens, allThemes: themes };
}
