import { apiClient } from "@/services/api-client";

export const commerceService = {
  getCart: (storeId: string, token: string) =>
    apiClient(`/api/v1/commerce/cart?storeId=${storeId}`, { method: "GET" }, token),

  addToCart: (payload: { storeId: string; variantId: string; quantity: number }, token: string) =>
    apiClient("/api/v1/commerce/cart", { method: "POST", body: JSON.stringify(payload) }, token),

  removeFromCart: (payload: { storeId: string; variantId: string }, token: string) =>
    apiClient("/api/v1/commerce/cart", { method: "DELETE", body: JSON.stringify(payload) }, token),

  createOrder: (payload: { storeId: string; shippingAddress: Record<string, unknown> }, token: string) =>
    apiClient("/api/v1/commerce/orders", { method: "POST", body: JSON.stringify(payload) }, token),

  listOrders: (token: string) => apiClient("/api/v1/commerce/orders", { method: "GET" }, token),
};
