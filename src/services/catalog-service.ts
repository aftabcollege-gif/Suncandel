import { apiClient } from "@/services/api-client";

export const catalogService = {
  listProducts: (storeId: string, token: string) =>
    apiClient(`/api/v1/catalog/products?storeId=${storeId}`, { method: "GET" }, token),

  listCategories: (token: string) => apiClient("/api/v1/catalog/categories", { method: "GET" }, token),
};
