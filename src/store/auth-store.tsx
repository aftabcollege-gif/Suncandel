"use client";

import { createContext, useContext, useMemo, useState } from "react";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  tenantId: string | null;
  setAuth: (auth: { accessToken: string; refreshToken: string; tenantId: string | null }) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  const setAuth = (auth: { accessToken: string; refreshToken: string; tenantId: string | null }) => {
    setAccessToken(auth.accessToken);
    setRefreshToken(auth.refreshToken);
    setTenantId(auth.tenantId);
  };

  const clearAuth = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setTenantId(null);
  };

  const value = useMemo(
    () => ({ accessToken, refreshToken, tenantId, setAuth, clearAuth }),
    [accessToken, refreshToken, tenantId]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthStore() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthStore must be used inside AuthProvider");
  return ctx;
}
