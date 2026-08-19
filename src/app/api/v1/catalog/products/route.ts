import { catalogService } from "@/Application/catalogService";
import { createProductSchema } from "@/API/schemas";
import { AppError } from "@/Shared/errors";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");

    if (!storeId || !auth.tenantId) {
      throw new AppError("پارامتر storeId یا tenant نامعتبر است", 422, "INVALID_INPUT");
    }

    const data = await catalogService.listProducts(storeId, auth.tenantId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "product:manage");

    if (!auth.tenantId) {
      throw new AppError("tenant برای این عملیات لازم است", 422, "TENANT_REQUIRED");
    }

    const body = await parseJson(req, createProductSchema);

    const data = await catalogService.createProduct({
      tenantId: auth.tenantId,
      actorUserId: auth.sub,
      storeId: body.storeId,
      categoryId: body.categoryId,
      title: body.title,
      description: body.description,
      basePrice: body.basePrice.toFixed(2),
      discountPercent: body.discountPercent?.toFixed(2),
      minStockLevel: body.minStockLevel,
      reorderPoint: body.reorderPoint,
      attributes: body.attributes,
      variants: body.variants.map((v) => ({
        sku: v.sku,
        title: v.title,
        price: v.price.toFixed(2),
        stockQty: v.stockQty,
        isDefault: v.isDefault,
        attributes: v.attributes,
      })),
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}
