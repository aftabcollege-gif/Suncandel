import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "inactive",
  "suspended",
]);

export const vendorStatusEnum = pgEnum("vendor_status", [
  "pending",
  "verified",
  "suspended",
  "rejected",
]);

export const storeStatusEnum = pgEnum("store_status", [
  "draft",
  "active",
  "inactive",
]);

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "archived",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "created",
  "confirmed",
  "processing",
  "shipping",
  "completed",
  "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);

export const stockMovementTypeEnum = pgEnum("stock_movement_type", [
  "in",
  "out",
  "adjustment",
]);

export const activityTypeEnum = pgEnum("activity_type", [
  "login",
  "search",
  "product_view",
  "add_to_cart",
  "purchase",
  "review",
  "interaction",
]);

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 64 }).notNull().unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "set null" }),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: varchar("email", { length: 255 }),
    passwordHash: text("password_hash"),
    status: userStatusEnum("status").notNull().default("active"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    phoneUnique: uniqueIndex("users_phone_unique").on(table.phone),
    emailIdx: index("users_email_idx").on(table.email),
    tenantIdx: index("users_tenant_idx").on(table.tenantId),
  })
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
    code: varchar("code", { length: 64 }).notNull(),
    name: varchar("name", { length: 128 }).notNull(),
    description: text("description"),
    isSystem: boolean("is_system").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    roleCodeUniquePerTenant: uniqueIndex("roles_code_tenant_unique").on(
      table.tenantId,
      table.code
    ),
  })
);

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 128 }).notNull().unique(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    permissionCodeIdx: index("permissions_code_idx").on(table.code),
  })
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  })
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    roleId: uuid("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.roleId] }),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    refreshTokenHash: text("refresh_token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("sessions_user_idx").on(table.userId),
  })
);

export const securityLogs = pgTable(
  "security_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 128 }).notNull(),
    level: varchar("level", { length: 32 }).notNull().default("info"),
    details: jsonb("details").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    actionIdx: index("security_logs_action_idx").on(table.action),
  })
);

export const vendors = pgTable(
  "vendors",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    ownerUserId: uuid("owner_user_id").notNull().references(() => users.id, { onDelete: "restrict" }),
    legalName: varchar("legal_name", { length: 255 }).notNull(),
    nationalId: varchar("national_id", { length: 32 }).notNull(),
    verificationStatus: vendorStatusEnum("verification_status").notNull().default("pending"),
    businessInfo: jsonb("business_info").notNull().default({}),
    financialInfo: jsonb("financial_info").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("vendors_tenant_idx").on(table.tenantId),
    ownerIdx: index("vendors_owner_idx").on(table.ownerUserId),
  })
);

export const stores = pgTable(
  "stores",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    vendorId: uuid("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    settings: jsonb("settings").notNull().default({}),
    status: storeStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugUniquePerTenant: uniqueIndex("stores_slug_tenant_unique").on(table.tenantId, table.slug),
    vendorIdx: index("stores_vendor_idx").on(table.vendorId),
  })
);

export const storeStaff = pgTable(
  "store_staff",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    roleCode: varchar("role_code", { length: 64 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    storeUserUnique: uniqueIndex("store_staff_store_user_unique").on(table.storeId, table.userId),
  })
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugUniquePerTenant: uniqueIndex("categories_slug_tenant_unique").on(table.tenantId, table.slug),
  })
);

export const brands = pgTable(
  "brands",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    slugUniquePerTenant: uniqueIndex("brands_slug_tenant_unique").on(table.tenantId, table.slug),
  })
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: "set null" }),
    brandId: uuid("brand_id").references(() => brands.id, { onDelete: "set null" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    status: productStatusEnum("status").notNull().default("draft"),
    basePrice: numeric("base_price", { precision: 14, scale: 2 }).notNull(),
    discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull().default("0"),
    minStockLevel: integer("min_stock_level").notNull().default(0),
    reorderPoint: integer("reorder_point").notNull().default(0),
    attributes: jsonb("attributes").notNull().default({}),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    storeIdx: index("products_store_idx").on(table.storeId),
    statusIdx: index("products_status_idx").on(table.status),
  })
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    sku: varchar("sku", { length: 128 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    price: numeric("price", { precision: 14, scale: 2 }).notNull(),
    stockQty: integer("stock_qty").notNull().default(0),
    isDefault: boolean("is_default").notNull().default(false),
    attributes: jsonb("attributes").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    skuUnique: uniqueIndex("product_variants_sku_unique").on(table.sku),
    productIdx: index("product_variants_product_idx").on(table.productId),
  })
);

export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productVariantId: uuid("product_variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    movementType: stockMovementTypeEnum("movement_type").notNull(),
    quantity: integer("quantity").notNull(),
    reason: text("reason").notNull(),
    referenceType: varchar("reference_type", { length: 64 }),
    referenceId: uuid("reference_id"),
    createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    variantIdx: index("inventory_movements_variant_idx").on(table.productVariantId),
  })
);

export const customers = pgTable(
  "customers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    preferences: jsonb("preferences").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userUnique: uniqueIndex("customers_user_unique").on(table.userId),
  })
);

export const customerAddresses = pgTable("customer_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  province: varchar("province", { length: 120 }).notNull(),
  city: varchar("city", { length: 120 }).notNull(),
  line1: text("line1").notNull(),
  postalCode: varchar("postal_code", { length: 20 }).notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const wishlists = pgTable("wishlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 120 }).notNull().default("پیش‌فرض"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    wishlistId: uuid("wishlist_id").notNull().references(() => wishlists.id, { onDelete: "cascade" }),
    productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.wishlistId, table.productId] }),
  })
);

export const customerActivities = pgTable(
  "customer_activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    type: activityTypeEnum("type").notNull(),
    meta: jsonb("meta").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    typeIdx: index("customer_activities_type_idx").on(table.type),
  })
);

export const carts = pgTable("carts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 32 }).notNull().default("active"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id").notNull().references(() => productVariants.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    unitPriceSnapshot: numeric("unit_price_snapshot", { precision: 14, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    cartVariantUnique: uniqueIndex("cart_items_cart_variant_unique").on(table.cartId, table.variantId),
  })
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "restrict" }),
    storeId: uuid("store_id").notNull().references(() => stores.id, { onDelete: "restrict" }),
    orderNo: varchar("order_no", { length: 64 }).notNull().unique(),
    status: orderStatusEnum("status").notNull().default("created"),
    totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
    shippingAddress: jsonb("shipping_address").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    orderNoIdx: index("orders_order_no_idx").on(table.orderNo),
    statusIdx: index("orders_status_idx").on(table.status),
  })
);

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 14, scale: 2 }).notNull(),
  discountPercent: numeric("discount_percent", { precision: 5, scale: 2 }).notNull().default("0"),
  taxAmount: numeric("tax_amount", { precision: 14, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
    gateway: varchar("gateway", { length: 64 }).notNull(),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    status: paymentStatusEnum("status").notNull().default("pending"),
    transactionRef: varchar("transaction_ref", { length: 128 }),
    callbackPayload: jsonb("callback_payload"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    orderIdx: index("payments_order_idx").on(table.orderId),
  })
);

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  invoiceNo: varchar("invoice_no", { length: 64 }).notNull().unique(),
  totalAmount: numeric("total_amount", { precision: 14, scale: 2 }).notNull(),
  payload: jsonb("payload").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const crmInteractions = pgTable(
  "crm_interactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    channel: varchar("channel", { length: 64 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    detail: text("detail").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantIdx: index("crm_interactions_tenant_idx").on(table.tenantId),
  })
);

export const customerSegments = pgTable(
  "customer_segments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    rule: jsonb("rule").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantNameUnique: uniqueIndex("customer_segments_tenant_name_unique").on(
      table.tenantId,
      table.name
    ),
  })
);

export const customerSegmentMembers = pgTable(
  "customer_segment_members",
  {
    segmentId: uuid("segment_id")
      .notNull()
      .references(() => customerSegments.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.segmentId, table.customerId] }),
  })
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "set null" }),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 128 }).notNull(),
    resource: varchar("resource", { length: 128 }).notNull(),
    resourceId: varchar("resource_id", { length: 128 }).notNull(),
    messageFa: text("message_fa").notNull(),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    resourceIdx: index("audit_logs_resource_idx").on(table.resource, table.resourceId),
  })
);

export const systemConfigurations = pgTable(
  "system_configurations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 128 }).notNull(),
    value: jsonb("value").notNull().default({}),
    isSecretRef: boolean("is_secret_ref").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    keyUniquePerTenant: uniqueIndex("system_config_tenant_key_unique").on(table.tenantId, table.key),
  })
);

export const aiModelStatusEnum = pgEnum("ai_model_status", ["active", "inactive", "deprecated"]);

export const aiInferenceTypeEnum = pgEnum("ai_inference_type", [
  "customer_assistant",
  "vendor_copilot",
  "recommendation",
  "search",
  "social_message",
  "automation",
  "analytics",
]);

export const automationRunStatusEnum = pgEnum("automation_run_status", [
  "pending",
  "running",
  "completed",
  "failed",
]);

export const aiModelRegistry = pgTable(
  "ai_model_registry",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    modelKey: varchar("model_key", { length: 128 }).notNull(),
    provider: varchar("provider", { length: 128 }).notNull(),
    version: varchar("version", { length: 64 }).notNull(),
    status: aiModelStatusEnum("status").notNull().default("active"),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    keyVersionUnique: uniqueIndex("ai_model_registry_tenant_key_version_unique").on(
      table.tenantId,
      table.modelKey,
      table.version
    ),
  })
);

export const aiInferences = pgTable(
  "ai_inferences",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    modelRegistryId: uuid("model_registry_id").references(() => aiModelRegistry.id, { onDelete: "set null" }),
    inferenceType: aiInferenceTypeEnum("inference_type").notNull(),
    inputPayload: jsonb("input_payload").notNull().default({}),
    outputPayload: jsonb("output_payload").notNull().default({}),
    explainability: jsonb("explainability").notNull().default({}),
    latencyMs: integer("latency_ms").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantTypeIdx: index("ai_inferences_tenant_type_idx").on(table.tenantId, table.inferenceType),
  })
);

export const customerIntelligenceProfiles = pgTable(
  "customer_intelligence_profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
    preferenceProfile: jsonb("preference_profile").notNull().default({}),
    interestProfile: jsonb("interest_profile").notNull().default({}),
    buyingPattern: jsonb("buying_pattern").notNull().default({}),
    segment: varchar("segment", { length: 128 }).notNull().default("new"),
    aiConsent: boolean("ai_consent").notNull().default(false),
    lastComputedAt: timestamp("last_computed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    customerUnique: uniqueIndex("customer_intelligence_customer_unique").on(table.customerId),
  })
);

export const aiRecommendationSnapshots = pgTable(
  "ai_recommendation_snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    contextType: varchar("context_type", { length: 64 }).notNull(),
    contextRefId: uuid("context_ref_id"),
    recommendations: jsonb("recommendations").notNull().default([]),
    generatedAt: timestamp("generated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantContextIdx: index("ai_recommendations_tenant_context_idx").on(table.tenantId, table.contextType),
  })
);

export const aiSearchLogs = pgTable(
  "ai_search_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    actorUserId: uuid("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    query: text("query").notNull(),
    normalizedQuery: text("normalized_query").notNull(),
    filters: jsonb("filters").notNull().default({}),
    resultsCount: integer("results_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantQueryIdx: index("ai_search_logs_tenant_query_idx").on(table.tenantId),
  })
);

export const instagramConnections = pgTable(
  "instagram_connections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    vendorId: uuid("vendor_id").notNull().references(() => vendors.id, { onDelete: "cascade" }),
    storeId: uuid("store_id").references(() => stores.id, { onDelete: "set null" }),
    instagramBusinessId: varchar("instagram_business_id", { length: 128 }).notNull(),
    accessTokenHash: text("access_token_hash").notNull(),
    status: varchar("status", { length: 32 }).notNull().default("connected"),
    lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    vendorBusinessUnique: uniqueIndex("instagram_connections_vendor_business_unique").on(
      table.vendorId,
      table.instagramBusinessId
    ),
  })
);

export const instagramMessages = pgTable(
  "instagram_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    connectionId: uuid("connection_id")
      .notNull()
      .references(() => instagramConnections.id, { onDelete: "cascade" }),
    senderHandle: varchar("sender_handle", { length: 255 }).notNull(),
    messageText: text("message_text").notNull(),
    intent: varchar("intent", { length: 64 }),
    extractedEntities: jsonb("extracted_entities").notNull().default({}),
    suggestedProducts: jsonb("suggested_products").notNull().default([]),
    orderIntent: jsonb("order_intent").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantConnectionIdx: index("instagram_messages_tenant_connection_idx").on(table.tenantId, table.connectionId),
  })
);

export const marketingAutomationRules = pgTable(
  "marketing_automation_rules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    triggerType: varchar("trigger_type", { length: 64 }).notNull(),
    targetChannel: varchar("target_channel", { length: 64 }).notNull(),
    conditionPayload: jsonb("condition_payload").notNull().default({}),
    actionPayload: jsonb("action_payload").notNull().default({}),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantTriggerIdx: index("marketing_rules_tenant_trigger_idx").on(table.tenantId, table.triggerType),
  })
);

export const marketingAutomationRuns = pgTable(
  "marketing_automation_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    ruleId: uuid("rule_id")
      .notNull()
      .references(() => marketingAutomationRules.id, { onDelete: "cascade" }),
    customerId: uuid("customer_id").references(() => customers.id, { onDelete: "set null" }),
    status: automationRunStatusEnum("status").notNull().default("pending"),
    output: jsonb("output").notNull().default({}),
    runAt: timestamp("run_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantStatusIdx: index("marketing_runs_tenant_status_idx").on(table.tenantId, table.status),
  })
);

export const aiPipelineJobs = pgTable(
  "ai_pipeline_jobs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    jobType: varchar("job_type", { length: 64 }).notNull(),
    payload: jsonb("payload").notNull().default({}),
    status: automationRunStatusEnum("status").notNull().default("pending"),
    result: jsonb("result").notNull().default({}),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantJobIdx: index("ai_pipeline_jobs_tenant_job_idx").on(table.tenantId, table.jobType),
  })
);

export const aiEvaluationRuns = pgTable(
  "ai_evaluation_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
    evaluationType: varchar("evaluation_type", { length: 64 }).notNull(),
    metrics: jsonb("metrics").notNull().default({}),
    notes: text("notes"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tenantEvalTypeIdx: index("ai_evaluation_runs_tenant_type_idx").on(table.tenantId, table.evaluationType),
  })
);
