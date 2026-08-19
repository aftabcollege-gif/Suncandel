import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import {
  cartItems,
  carts,
  invoices,
  orderItems,
  orders,
  payments,
  productVariants,
  products,
} from "@/db/schema";

export class CommerceRepository {
  async getOrCreateActiveCart(input: { tenantId: string; customerId: string; storeId: string }) {
    const existing = await db
      .select()
      .from(carts)
      .where(
        and(
          eq(carts.tenantId, input.tenantId),
          eq(carts.customerId, input.customerId),
          eq(carts.storeId, input.storeId),
          eq(carts.status, "active")
        )
      )
      .limit(1);

    if (existing[0]) return existing[0];

    const created = await db
      .insert(carts)
      .values({
        tenantId: input.tenantId,
        customerId: input.customerId,
        storeId: input.storeId,
        status: "active",
      })
      .returning();

    return created[0];
  }

  async getCartWithItems(cartId: string) {
    const cart = await db.select().from(carts).where(eq(carts.id, cartId)).limit(1);
    const items = await db
      .select({
        id: cartItems.id,
        cartId: cartItems.cartId,
        variantId: cartItems.variantId,
        quantity: cartItems.quantity,
        unitPriceSnapshot: cartItems.unitPriceSnapshot,
        variantSku: productVariants.sku,
        variantTitle: productVariants.title,
      })
      .from(cartItems)
      .innerJoin(productVariants, eq(productVariants.id, cartItems.variantId))
      .where(eq(cartItems.cartId, cartId));

    return { cart: cart[0] ?? null, items };
  }

  async upsertCartItem(input: {
    cartId: string;
    variantId: string;
    quantity: number;
    unitPriceSnapshot: string;
  }) {
    const rows = await db
      .insert(cartItems)
      .values(input)
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.variantId],
        set: {
          quantity: input.quantity,
          unitPriceSnapshot: input.unitPriceSnapshot,
          updatedAt: new Date(),
        },
      })
      .returning();

    return rows[0];
  }

  async removeCartItem(cartId: string, variantId: string) {
    await db.delete(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.variantId, variantId)));
  }

  async listVariantsByIds(variantIds: string[]) {
    if (variantIds.length === 0) return [];

    return db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        sku: productVariants.sku,
        title: productVariants.title,
        price: productVariants.price,
        stockQty: productVariants.stockQty,
      })
      .from(productVariants)
      .where(inArray(productVariants.id, variantIds));
  }

  async listVariantsByIdsInTenant(tenantId: string, variantIds: string[]) {
    if (variantIds.length === 0) return [];

    return db
      .select({
        id: productVariants.id,
        productId: productVariants.productId,
        sku: productVariants.sku,
        title: productVariants.title,
        price: productVariants.price,
        stockQty: productVariants.stockQty,
      })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(and(inArray(productVariants.id, variantIds), eq(products.tenantId, tenantId)));
  }

  async createOrder(input: {
    tenantId: string;
    customerId: string;
    storeId: string;
    orderNo: string;
    totalAmount: string;
    shippingAddress: Record<string, unknown>;
  }) {
    const rows = await db.insert(orders).values(input).returning();
    return rows[0];
  }

  async addOrderItem(input: {
    orderId: string;
    productId: string;
    variantId: string;
    quantity: number;
    unitPrice: string;
    discountPercent?: string;
    taxAmount?: string;
  }) {
    const rows = await db
      .insert(orderItems)
      .values({
        ...input,
        discountPercent: input.discountPercent ?? "0",
        taxAmount: input.taxAmount ?? "0",
      })
      .returning();

    return rows[0];
  }

  async getOrderById(orderId: string, tenantId: string) {
    const rows = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.tenantId, tenantId)))
      .limit(1);
    return rows[0] ?? null;
  }

  async listOrdersByCustomer(customerId: string, tenantId: string) {
    return db
      .select()
      .from(orders)
      .where(and(eq(orders.customerId, customerId), eq(orders.tenantId, tenantId)))
      .orderBy(desc(orders.createdAt));
  }

  async updateOrderStatus(orderId: string, status: "created" | "confirmed" | "processing" | "shipping" | "completed" | "cancelled") {
    const rows = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    return rows[0] ?? null;
  }

  async createPayment(input: { orderId: string; gateway: string; amount: string; transactionRef?: string | null }) {
    const rows = await db
      .insert(payments)
      .values({
        orderId: input.orderId,
        gateway: input.gateway,
        amount: input.amount,
        transactionRef: input.transactionRef ?? null,
        status: "pending",
      })
      .returning();
    return rows[0];
  }

  async getPaymentById(paymentId: string) {
    const rows = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
    return rows[0] ?? null;
  }

  async updatePaymentStatus(input: {
    paymentId: string;
    status: "pending" | "paid" | "failed" | "refunded";
    callbackPayload?: Record<string, unknown>;
    transactionRef?: string;
  }) {
    const rows = await db
      .update(payments)
      .set({
        status: input.status,
        transactionRef: input.transactionRef,
        callbackPayload: input.callbackPayload,
        paidAt: input.status === "paid" ? new Date() : null,
      })
      .where(eq(payments.id, input.paymentId))
      .returning();
    return rows[0] ?? null;
  }

  async createInvoice(input: {
    orderId: string;
    invoiceNo: string;
    totalAmount: string;
    payload?: Record<string, unknown>;
  }) {
    const rows = await db
      .insert(invoices)
      .values({
        orderId: input.orderId,
        invoiceNo: input.invoiceNo,
        totalAmount: input.totalAmount,
        payload: input.payload ?? {},
      })
      .returning();

    return rows[0];
  }

  async listInvoiceByOrderId(orderId: string) {
    return db.select().from(invoices).where(eq(invoices.orderId, orderId));
  }

  async getCartItemsByCartId(cartId: string) {
    return db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
  }

  async clearCart(cartId: string) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    await db.update(carts).set({ updatedAt: new Date() }).where(eq(carts.id, cartId));
  }

  async getProductByVariantId(variantId: string) {
    const rows = await db
      .select({ productId: products.id })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(eq(productVariants.id, variantId))
      .limit(1);
    return rows[0] ?? null;
  }

  async getProductByVariantIdInTenant(tenantId: string, variantId: string) {
    const rows = await db
      .select({ productId: products.id })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(and(eq(productVariants.id, variantId), eq(products.tenantId, tenantId)))
      .limit(1);
    return rows[0] ?? null;
  }
}
