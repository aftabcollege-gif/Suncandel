import { catalogService } from "@/Application/catalogService";
import { createCategorySchema } from "@/API/schemas";
import { requireAuth, requirePermission } from "@/Shared/auth";
import { handleError, ok, parseJson } from "@/Shared/http";

export async function GET(req: Request) {
  try {
    const auth = await requireAuth(req);
    const tenantId = auth.tenantId;
    const data = await catalogService.listCategories(tenantId);
    return ok(data);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuth(req);
    requirePermission(auth.permissions, "product:manage");

    const body = await parseJson(req, createCategorySchema);
    const data = await catalogService.createCategory({
      tenantId: auth.tenantId,
      name: body.name,
      slug: body.slug,
      parentId: body.parentId,
    });

    return ok(data, 201);
  } catch (error) {
    return handleError(error);
  }
}
