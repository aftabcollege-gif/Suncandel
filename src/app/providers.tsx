"use client";

import { ThemeProvider } from "@/store/theme-store";
import { AuthProvider } from "@/store/auth-store";
import { StorefrontProvider } from "@/store/storefront-store";
import type { StorefrontConfig } from "@/themes/storefronts";
import type { ThemeName } from "@/themes/theme-types";

export function Providers({
  children,
  storefront,
  initialTheme,
}: {
  children: React.ReactNode;
  storefront: StorefrontConfig;
  initialTheme: ThemeName;
}) {
  return (
    <StorefrontProvider storefront={storefront}>
      <ThemeProvider initialTheme={initialTheme}>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </StorefrontProvider>
  );
}
