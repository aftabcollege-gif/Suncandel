import { and, eq } from "drizzle-orm";
import { AppError } from "@/Shared/errors";
import { CommerceRepository } from "@/Infrastructure/repositories/commerceRepository";
import { CustomerRepository } from "@/Infrastructure/repositories/customerRepository";
import { CatalogRepository } from "@/Infrastructure/repositories/catalogRepository";
import { db } from "@/db";
import { orderItems, orders, productVariants } from "@/db/schema";
import { assertEnoughStock } from "@/Domain/catalog/inventoryRules";
import { computeOrderTotal } from "@/Domain/catalog/pricing";
import { assertValidOrderTransition } from "@/Domain/commerce/orderRules";
import { generateInvoiceNo, generateOrderNo } from "@/Shared/ids";
import { writeAuditLog } from "@/Shared/audit";

const commerceRepo = new CommerceRepository();
const customerRepo = new CustomerRepository();
const catalogRepo = new CatalogRepository();

export class CommerceService {
  async getOrCreateCart(input: { tenantId: string; userId: string; storeId: string }) {
    const customer = await customerRepo.getOrCreateByUserId(input.userId, input.tenantId);
    const cart = await commerceRepo.getOrCreateActiveCart({
      tenantId: input.tenantId,
      customerId: customer.id,
      storeId: input.storeId,
    });

    return commerceRepo.getCartWithItems(cart.id);
  }

  async addCartItem(input: { tenantId: string; userId: string; storeId: string; variantId: string; quantity: number }) {
    const customer = await customerRepo.getOrCreateByUserId(input.userId, input.tenantId);
    const cart = await commerceRepo.getOrCreateActiveCart({
      tenantId: input.tenantId,
      customerId: customer.id,
      storeId: input.storeId,
    });

    const variant = await catalogRepo.findVariantInTenant(input.tenantId, input.variantId);
    if (!variant) {
      throw new AppError("واریانت انتخابی یافت نشد", 404, "VARIANT_NOT_FOUND");
    }

    assertEnoughStock(variant.stockQty, input.quantity, variant.sku);

    await commerceRepo.upsertCartItem({
      cartId: cart.id,
      variantId: variant.id,
      quantity: input.quantity,
      unitPriceSnapshot: variant.price,
    });

    await customerRepo.addActivity({
      customerId: customer.id,
      type: "add_to_cart",
      meta: { variantId: variant.id, quantity: input.quantity },
    });

    return commerceRepo.getCartWithItems(cart.id);
  }

  async removeCartItem(input: { tenantId: string; userId: string; storeId: string; variantId: string }) {
    const customer = await customerRepo.getOrCreateByUserId(input.userId, input.tenantId);
    const cart = await commerceRepo.getOrCreateActiveCart({
      tenantId: input.tenantId,
      customerId: customer.id,
      storeId: input.storeId,
    });

    await commerceRepo.removeCartItem(cart.id, input.variantId);
    return commerceRepo.getCartWithItems(cart.id);
  }

  async createOrder(input: {
    tenantId: string;
    userId: string;
    storeId: string;
    shippingAddress: Record<string, unknown>;
  }) {
    const customer = await customerRepo.getOrCreateByUserId(input.userId, input.tenantId);
    const cart = await commerceRepo.getOrCreateActiveCart({
      tenantId: input.tenantId,
      customerId: customer.id,
      storeId: input.storeId,
    });

    const cartData = await commerceRepo.getCartWithItems(cart.id);
    if (cartData.items.length === 0) {
      throw new AppError("سبد خرید خالی است", 422, "EMPTY_CART");
    }

    const variantIds = cartData.items.map((i) => i.variantId);
    const variants = await commerceRepo.listVariantsByIdsInTenant(input.tenantId, variantIds);

    const lines: Array<{ variantId: string; productId: string; quantity: number; unitPrice: number }> = [];

    for (const item of cartData.items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new AppError("واریانت سبد خرید نامعتبر است", 422, "INVALID_CART_ITEM");
      }
      assertEnoughStock(variant.stockQty, item.quantity, variant.sku);

      const productLink = await commerceRepo.getProductByVariantIdInTenant(input.tenantId, variant.id);
      if (!productLink) {
        throw new AppError("محصول واریانت یافت نشد", 404, "PRODUCT_NOT_FOUND");
      }

      lines.push({
        variantId: variant.id,
        productId: productLink.productId,
        quantity: item.quantity,
        unitPrice: Number(variant.price),
      });
    }

    const totalAmountNumber = computeOrderTotal(lines);
    const order = await commerceRepo.createOrder({
      tenantId: input.tenantId,
      customerId: customer.id,
      storeId: input.storeId,
      orderNo: generateOrderNo(),
      totalAmount: totalAmountNumber.toFixed(2),
      shippingAddress: input.shippingAddress,
    });

    for (const line of lines) {
      await commerceRepo.addOrderItem({
        orderId: order.id,
        productId: line.productId,
        variantId: line.variantId,
        quantity: line.quantity,
        unitPrice: line.unitPrice.toFixed(2),
      });

      const decremented = await catalogRepo.decrementVariantStockAtomic(line.variantId, line.quantity);
      if (!decremented) {
        throw new AppError("موجودی محصول در لحظه پرداخت کافی نیست", 409, "STOCK_CONFLICT");
      }

      await catalogRepo.createInventoryMovement({
        productVariantId: line.variantId,
        movementType: "out",
        quantity: line.quantity,
        reason: `کسر موجودی به‌دلیل ثبت سفارش ${order.orderNo}`,
        referenceType: "order",
        referenceId: order.id,
        createdBy: input.userId,
      });
    }

    await commerceRepo.createInvoice({
      orderId: order.id,
      invoiceNo: generateInvoiceNo(),
      totalAmount: order.totalAmount,
      payload: { orderNo: order.orderNo },
    });

    await commerceRepo.clearCart(cart.id);

    await customerRepo.addActivity({
      customerId: customer.id,
      type: "purchase",
      meta: { orderId: order.id, orderNo: order.orderNo, totalAmount: order.totalAmount },
    });

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.userId,
      action: "order.create",
      resource: "order",
      resourceId: order.id,
      messageFa: `سفارش ${order.orderNo} ایجاد شد`,
      metadata: { totalAmount: order.totalAmount },
    });

    return {
      order,
      items: await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
      invoices: await commerceRepo.listInvoiceByOrderId(order.id),
    };
  }

  async listOrders(tenantId: string, userId: string) {
    const customer = await customerRepo.getOrCreateByUserId(userId, tenantId);
    return commerceRepo.listOrdersByCustomer(customer.id, tenantId);
  }

  async updateOrderStatus(input: {
    tenantId: string;
    actorUserId: string;
    orderId: string;
    nextStatus: "created" | "confirmed" | "processing" | "shipping" | "completed" | "cancelled";
  }) {
    const order = await commerceRepo.getOrderById(input.orderId, input.tenantId);
    if (!order) {
      throw new AppError("سفارش یافت نشد", 404, "ORDER_NOT_FOUND");
    }

    assertValidOrderTransition(order.status, input.nextStatus);
    const updated = await commerceRepo.updateOrderStatus(order.id, input.nextStatus);

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      action: "order.status.update",
      resource: "order",
      resourceId: order.id,
      messageFa: `وضعیت سفارش ${order.orderNo} به ${input.nextStatus} تغییر یافت`,
    });

    return updated;
  }

  async initiatePayment(input: {
    tenantId: string;
    actorUserId: string;
    orderId: string;
    gateway: string;
  }) {
    const order = await commerceRepo.getOrderById(input.orderId, input.tenantId);
    if (!order) {
      throw new AppError("سفارش یافت نشد", 404, "ORDER_NOT_FOUND");
    }

    const payment = await commerceRepo.createPayment({
      orderId: order.id,
      gateway: input.gateway,
      amount: order.totalAmount,
      transactionRef: `P-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    });

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      action: "payment.initiate",
      resource: "payment",
      resourceId: payment.id,
      messageFa: `پرداخت برای سفارش ${order.orderNo} آغاز شد`,
    });

    return {
      payment,
      gatewayRedirectUrl: `https://gateway.example/redirect/${payment.transactionRef}`,
    };
  }

  async paymentCallback(input: {
    paymentId: string;
    status: "paid" | "failed";
    transactionRef: string;
    payload?: Record<string, unknown>;
  }) {
    const current = await commerceRepo.getPaymentById(input.paymentId);
    if (!current) {
      throw new AppError("پرداخت یافت نشد", 404, "PAYMENT_NOT_FOUND");
    }

    if (current.status === "paid" && input.status === "paid") {
      await writeAuditLog({
        action: "payment.callback.duplicate",
        resource: "payment",
        resourceId: current.id,
        messageFa: "callback تکراری پرداخت دریافت شد و بدون تغییر پردازش گردید",
        metadata: { transactionRef: input.transactionRef },
      });
      return current;
    }

    const payment = await commerceRepo.updatePaymentStatus({
      paymentId: input.paymentId,
      status: input.status,
      transactionRef: input.transactionRef,
      callbackPayload: input.payload,
    });

    if (!payment) {
      throw new AppError("پرداخت یافت نشد", 404, "PAYMENT_NOT_FOUND");
    }

    const orderRows = await db.select().from(orders).where(eq(orders.id, payment.orderId)).limit(1);
    const order = orderRows[0];
    if (!order) {
      throw new AppError("سفارش پرداخت یافت نشد", 404, "ORDER_NOT_FOUND");
    }

    if (input.status === "paid") {
      const canMove = ["created", "confirmed"].includes(order.status);
      if (canMove) {
        await commerceRepo.updateOrderStatus(order.id, "confirmed");
      }
    }

    await writeAuditLog({
      tenantId: order.tenantId,
      action: "payment.callback",
      resource: "payment",
      resourceId: payment.id,
      messageFa:
        input.status === "paid"
          ? `پرداخت سفارش ${order.orderNo} با موفقیت تایید شد`
          : `پرداخت سفارش ${order.orderNo} ناموفق بود`,
      metadata: { transactionRef: input.transactionRef },
    });

    return payment;
  }
}

export const commerceService = new CommerceService();
