import { apiClient } from "@/services/api-client";

export type LoginResponse = { accessToken: string; refreshToken: string; userId: string; tenantId: string | null };

export const authService = {
  register: (payload: { fullName: string; phone: string; email?: string; password: string }) =>
    apiClient("/api/v1/auth/register", { method: "POST", body: JSON.stringify(payload) }),

  login: (payload: { phone: string; password: string }) =>
    apiClient<LoginResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify(payload) }),

  me: (token: string) => apiClient("/api/v1/auth/me", { method: "GET" }, token),
};
