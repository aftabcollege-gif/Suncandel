"use client";

import { createContext, useContext } from "react";
import type { StorefrontConfig } from "@/themes/storefronts";

type StorefrontContextValue = {
  storefront: StorefrontConfig;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({
  storefront,
  children,
}: {
  storefront: StorefrontConfig;
  children: React.ReactNode;
}) {
  return <StorefrontContext.Provider value={{ storefront }}>{children}</StorefrontContext.Provider>;
}

export function useStorefront() {
  const ctx = useContext(StorefrontContext);
  if (!ctx) throw new Error("useStorefront must be used within StorefrontProvider");
  return ctx.storefront;
}
