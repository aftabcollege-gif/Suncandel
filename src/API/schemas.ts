import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional(),
  password: z.string().min(8),
  roleCode: z.enum(["super_admin", "admin", "vendor", "staff", "customer"]).optional(),
});

export const loginSchema = z.object({
  phone: z.string().min(4).max(32),
  password: z.string().min(8),
});

export const refreshSchema = z.object({ refreshToken: z.string().min(10) });
export const logoutSchema = z.object({ refreshToken: z.string().min(10) });

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  email: z.string().email().nullable().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

export const createVendorSchema = z.object({
  legalName: z.string().min(2),
  nationalId: z.string().min(6),
  businessInfo: z.record(z.string(), z.unknown()).optional(),
  financialInfo: z.record(z.string(), z.unknown()).optional(),
});

export const createStoreSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const addStaffSchema = z.object({
  userId: z.string().uuid(),
  roleCode: z.enum(["vendor", "staff", "admin"]),
});

export const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  parentId: z.string().uuid().optional(),
});

export const createProductSchema = z.object({
  storeId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  title: z.string().min(2),
  description: z.string().min(5),
  basePrice: z.coerce.number().positive(),
  discountPercent: z.coerce.number().min(0).max(100).optional(),
  minStockLevel: z.coerce.number().int().min(0).optional(),
  reorderPoint: z.coerce.number().int().min(0).optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  variants: z
    .array(
      z.object({
        sku: z.string().min(2),
        title: z.string().min(2),
        price: z.coerce.number().positive(),
        stockQty: z.coerce.number().int().min(0),
        isDefault: z.boolean().optional(),
        attributes: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .min(1),
});

export const inventoryAdjustSchema = z.object({
  variantId: z.string().uuid(),
  movementType: z.enum(["in", "out", "adjustment"]),
  quantity: z.coerce.number().int().positive(),
  reason: z.string().min(3),
  referenceType: z.string().optional(),
  referenceId: z.string().uuid().optional(),
});

export const cartUpsertSchema = z.object({
  storeId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
});

export const cartRemoveSchema = z.object({
  storeId: z.string().uuid(),
  variantId: z.string().uuid(),
});

export const createOrderSchema = z.object({
  storeId: z.string().uuid(),
  shippingAddress: z.record(z.string(), z.unknown()),
});

export const updateOrderStatusSchema = z.object({
  nextStatus: z.enum(["created", "confirmed", "processing", "shipping", "completed", "cancelled"]),
});

export const initiatePaymentSchema = z.object({
  orderId: z.string().uuid(),
  gateway: z.string().min(2),
});

export const paymentCallbackSchema = z.object({
  paymentId: z.string().uuid(),
  status: z.enum(["paid", "failed"]),
  transactionRef: z.string().min(2),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export const customerPreferencesSchema = z.object({
  preferences: z.record(z.string(), z.unknown()),
});

export const customerAddressSchema = z.object({
  province: z.string().min(2),
  city: z.string().min(2),
  line1: z.string().min(5),
  postalCode: z.string().min(5),
  isDefault: z.boolean().optional(),
});

export const activitySchema = z.object({
  type: z.enum(["login", "search", "product_view", "add_to_cart", "purchase", "review", "interaction"]),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const createInteractionSchema = z.object({
  customerId: z.string().uuid(),
  channel: z.string().min(2),
  subject: z.string().min(2),
  detail: z.string().min(3),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const aiCustomerAssistantSchema = z.object({
  query: z.string().min(2),
  storeId: z.string().uuid().optional(),
});

export const aiVendorProductCopilotSchema = z.object({
  storeId: z.string().uuid(),
  productName: z.string().min(2),
  categoryHint: z.string().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
});

export const aiStoreScopedSchema = z.object({
  storeId: z.string().uuid(),
});

export const aiSearchSchema = z.object({
  query: z.string().min(2),
  filters: z
    .object({
      minPrice: z.coerce.number().min(0).optional(),
      maxPrice: z.coerce.number().min(0).optional(),
      categoryId: z.string().uuid().optional(),
      storeId: z.string().uuid().optional(),
    })
    .optional(),
});

export const aiProductRecommendationSchema = z.object({
  productId: z.string().uuid(),
});

export const aiInstagramConnectSchema = z.object({
  vendorId: z.string().uuid(),
  storeId: z.string().uuid().optional(),
  instagramBusinessId: z.string().min(3),
  accessToken: z.string().min(10),
});

export const aiInstagramMessageSchema = z.object({
  connectionId: z.string().uuid(),
  senderHandle: z.string().min(2),
  messageText: z.string().min(2),
});

export const aiPipelineSchema = z.object({
  jobType: z.enum(["customer_intelligence_refresh", "recommendation_refresh"]),
});

export const aiCartRecommendationSchema = z.object({
  variantIds: z.array(z.string().uuid()).min(1),
});

export const aiAfterPurchaseSchema = z.object({
  orderId: z.string().uuid(),
});
