import { db } from "@/db";
import { tenants } from "@/db/schema";

export async function resolveTenantId(req: Request) {
  const headerTenantId = req.headers.get("x-tenant-id");
  if (headerTenantId) return headerTenantId;

  const all = await db.select({ id: tenants.id }).from(tenants).limit(1);
  return all[0]?.id ?? null;
}
