import { and, eq, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  inventoryMovements,
  productVariants,
  products,
  stores,
} from "@/db/schema";

export class CatalogRepository {
  async createCategory(input: { tenantId?: string | null; name: string; slug: string; parentId?: string | null }) {
    const rows = await db
      .insert(categories)
      .values({
        tenantId: input.tenantId ?? null,
        name: input.name,
        slug: input.slug,
        parentId: input.parentId ?? null,
      })
      .returning();
    return rows[0];
  }

  async listCategories(tenantId?: string | null) {
    if (!tenantId) {
      return db.select().from(categories).where(isNull(categories.tenantId));
    }
    return db.select().from(categories).where(eq(categories.tenantId, tenantId));
  }

  async createProduct(input: {
    tenantId: string;
    storeId: string;
    categoryId?: string | null;
    title: string;
    description: string;
    basePrice: string;
    discountPercent?: string;
    minStockLevel?: number;
    reorderPoint?: number;
    attributes?: Record<string, unknown>;
  }) {
    const rows = await db
      .insert(products)
      .values({
        tenantId: input.tenantId,
        storeId: input.storeId,
        categoryId: input.categoryId ?? null,
        title: input.title,
        description: input.description,
        basePrice: input.basePrice,
        discountPercent: input.discountPercent ?? "0",
        minStockLevel: input.minStockLevel ?? 0,
        reorderPoint: input.reorderPoint ?? 0,
        attributes: input.attributes ?? {},
        status: "published",
      })
      .returning();
    return rows[0];
  }

  async createVariant(input: {
    productId: string;
    sku: string;
    title: string;
    price: string;
    stockQty: number;
    isDefault?: boolean;
    attributes?: Record<string, unknown>;
  }) {
    const rows = await db
      .insert(productVariants)
      .values({
        productId: input.productId,
        sku: input.sku,
        title: input.title,
        price: input.price,
        stockQty: input.stockQty,
        isDefault: input.isDefault ?? false,
        attributes: input.attributes ?? {},
      })
      .returning();
    return rows[0];
  }

  async listProductsByStore(storeId: string, tenantId: string) {
    return db
      .select()
      .from(products)
      .innerJoin(stores, eq(stores.id, products.storeId))
      .where(and(eq(products.storeId, storeId), eq(products.tenantId, tenantId), isNull(products.deletedAt)));
  }

  async findVariantById(variantId: string) {
    const rows = await db.select().from(productVariants).where(eq(productVariants.id, variantId)).limit(1);
    return rows[0] ?? null;
  }

  async updateVariantStock(variantId: string, stockQty: number) {
    const rows = await db
      .update(productVariants)
      .set({ stockQty, updatedAt: new Date() })
      .where(eq(productVariants.id, variantId))
      .returning();
    return rows[0] ?? null;
  }

  async decrementVariantStockAtomic(variantId: string, quantity: number) {
    const result = await db.execute(sql`
      update product_variants
      set stock_qty = stock_qty - ${quantity}, updated_at = now()
      where id = ${variantId} and stock_qty >= ${quantity}
      returning id, sku, stock_qty
    `);

    return result.rows[0] ?? null;
  }

  async createInventoryMovement(input: {
    productVariantId: string;
    movementType: "in" | "out" | "adjustment";
    quantity: number;
    reason: string;
    referenceType?: string;
    referenceId?: string;
    createdBy?: string;
  }) {
    const rows = await db
      .insert(inventoryMovements)
      .values({
        ...input,
        referenceType: input.referenceType ?? null,
        referenceId: input.referenceId ?? null,
        createdBy: input.createdBy ?? null,
      })
      .returning();
    return rows[0];
  }

  async listInventoryMovements(variantId: string) {
    return db
      .select()
      .from(inventoryMovements)
      .where(eq(inventoryMovements.productVariantId, variantId));
  }

  async findVariantInTenant(tenantId: string, variantId: string) {
    const rows = await db
      .select({
        id: productVariants.id,
        sku: productVariants.sku,
        title: productVariants.title,
        price: productVariants.price,
        stockQty: productVariants.stockQty,
      })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(and(eq(productVariants.id, variantId), eq(products.tenantId, tenantId), isNull(products.deletedAt)))
      .limit(1);

    return rows[0] ?? null;
  }

  async listInventoryMovementsByTenant(tenantId: string, variantId: string) {
    return db
      .select({
        id: inventoryMovements.id,
        productVariantId: inventoryMovements.productVariantId,
        movementType: inventoryMovements.movementType,
        quantity: inventoryMovements.quantity,
        reason: inventoryMovements.reason,
        referenceType: inventoryMovements.referenceType,
        referenceId: inventoryMovements.referenceId,
        createdBy: inventoryMovements.createdBy,
        createdAt: inventoryMovements.createdAt,
      })
      .from(inventoryMovements)
      .innerJoin(productVariants, eq(productVariants.id, inventoryMovements.productVariantId))
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(and(eq(products.tenantId, tenantId), eq(inventoryMovements.productVariantId, variantId), isNull(products.deletedAt)));
  }
}
