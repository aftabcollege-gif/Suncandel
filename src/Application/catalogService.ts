import { AppError } from "@/Shared/errors";
import { CatalogRepository } from "@/Infrastructure/repositories/catalogRepository";
import { writeAuditLog } from "@/Shared/audit";

const catalogRepo = new CatalogRepository();

export class CatalogService {
  async createCategory(input: { tenantId?: string | null; name: string; slug: string; parentId?: string | null }) {
    return catalogRepo.createCategory(input);
  }

  async listCategories(tenantId?: string | null) {
    return catalogRepo.listCategories(tenantId);
  }

  async createProduct(input: {
    tenantId: string;
    actorUserId: string;
    storeId: string;
    categoryId?: string | null;
    title: string;
    description: string;
    basePrice: string;
    discountPercent?: string;
    minStockLevel?: number;
    reorderPoint?: number;
    attributes?: Record<string, unknown>;
    variants: Array<{
      sku: string;
      title: string;
      price: string;
      stockQty: number;
      isDefault?: boolean;
      attributes?: Record<string, unknown>;
    }>;
  }) {
    if (input.variants.length === 0) {
      throw new AppError("حداقل یک واریانت برای محصول لازم است", 422, "VARIANT_REQUIRED");
    }

    const product = await catalogRepo.createProduct(input);

    const variants = [];
    for (const variant of input.variants) {
      const created = await catalogRepo.createVariant({ productId: product.id, ...variant });
      variants.push(created);

      await catalogRepo.createInventoryMovement({
        productVariantId: created.id,
        movementType: "in",
        quantity: variant.stockQty,
        reason: "ثبت اولیه موجودی محصول",
        referenceType: "product",
        referenceId: product.id,
        createdBy: input.actorUserId,
      });
    }

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      action: "product.create",
      resource: "product",
      resourceId: product.id,
      messageFa: `محصول ${product.title} ایجاد شد`,
    });

    return { product, variants };
  }

  async listProducts(storeId: string, tenantId: string) {
    return catalogRepo.listProductsByStore(storeId, tenantId);
  }

  async adjustInventory(input: {
    tenantId: string;
    actorUserId: string;
    variantId: string;
    movementType: "in" | "out" | "adjustment";
    quantity: number;
    reason: string;
    referenceType?: string;
    referenceId?: string;
  }) {
    const variant = await catalogRepo.findVariantInTenant(input.tenantId, input.variantId);
    if (!variant) {
      throw new AppError("واریانت یافت نشد", 404, "VARIANT_NOT_FOUND");
    }

    const sign = input.movementType === "out" ? -1 : 1;
    const newStock = variant.stockQty + sign * input.quantity;
    if (newStock < 0) {
      throw new AppError("موجودی منفی مجاز نیست", 422, "NEGATIVE_STOCK");
    }

    const updated = await catalogRepo.updateVariantStock(variant.id, newStock);
    await catalogRepo.createInventoryMovement({
      productVariantId: variant.id,
      movementType: input.movementType,
      quantity: input.quantity,
      reason: input.reason,
      referenceType: input.referenceType,
      referenceId: input.referenceId,
      createdBy: input.actorUserId,
    });

    return updated;
  }

  async inventoryHistory(tenantId: string, variantId: string) {
    const variant = await catalogRepo.findVariantInTenant(tenantId, variantId);
    if (!variant) {
      throw new AppError("واریانت یافت نشد", 404, "VARIANT_NOT_FOUND");
    }

    return catalogRepo.listInventoryMovementsByTenant(tenantId, variantId);
  }
}

export const catalogService = new CatalogService();
