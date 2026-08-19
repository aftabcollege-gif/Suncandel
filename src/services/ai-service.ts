import { apiClient } from "@/services/api-client";

export const aiService = {
  customerAssistant: (payload: { query: string; storeId?: string }, token: string) =>
    apiClient("/api/v1/ai/assistant/customer", { method: "POST", body: JSON.stringify(payload) }, token),

  search: (
    payload: { query: string; filters?: { minPrice?: number; maxPrice?: number; categoryId?: string; storeId?: string } },
    token: string
  ) => apiClient("/api/v1/ai/search", { method: "POST", body: JSON.stringify(payload) }, token),

  homepageRecommendations: (storeId: string | undefined, token: string) =>
    apiClient(`/api/v1/ai/recommendations/homepage${storeId ? `?storeId=${storeId}` : ""}`, { method: "GET" }, token),
};
