import { apiClient } from "@/services/api-client";

export const crmService = {
  listInteractions: (token: string) => apiClient("/api/v1/crm/interactions", { method: "GET" }, token),
};
