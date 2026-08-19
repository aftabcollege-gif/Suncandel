import { apiClient } from "@/services/api-client";

export const vendorService = {
  listVendors: (token: string) => apiClient("/api/v1/vendors", { method: "GET" }, token),
  listStores: (vendorId: string, token: string) =>
    apiClient(`/api/v1/vendors/${vendorId}/stores`, { method: "GET" }, token),
};
