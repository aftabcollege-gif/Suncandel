import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { storeStaff, stores, vendors } from "@/db/schema";

export class VendorRepository {
  async createVendor(input: {
    tenantId: string;
    ownerUserId: string;
    legalName: string;
    nationalId: string;
    businessInfo?: Record<string, unknown>;
    financialInfo?: Record<string, unknown>;
  }) {
    const rows = await db
      .insert(vendors)
      .values({
        ...input,
        businessInfo: input.businessInfo ?? {},
        financialInfo: input.financialInfo ?? {},
      })
      .returning();
    return rows[0];
  }

  async listVendorsByTenant(tenantId: string) {
    return db.select().from(vendors).where(eq(vendors.tenantId, tenantId));
  }

  async findVendorById(vendorId: string, tenantId: string) {
    const rows = await db
      .select()
      .from(vendors)
      .where(and(eq(vendors.id, vendorId), eq(vendors.tenantId, tenantId)))
      .limit(1);

    return rows[0] ?? null;
  }

  async createStore(input: {
    tenantId: string;
    vendorId: string;
    name: string;
    slug: string;
    settings?: Record<string, unknown>;
  }) {
    const rows = await db
      .insert(stores)
      .values({
        tenantId: input.tenantId,
        vendorId: input.vendorId,
        name: input.name,
        slug: input.slug,
        settings: input.settings ?? {},
        status: "active",
      })
      .returning();
    return rows[0];
  }

  async listStores(vendorId: string, tenantId: string) {
    return db
      .select()
      .from(stores)
      .where(and(eq(stores.vendorId, vendorId), eq(stores.tenantId, tenantId)));
  }

  async findStoreById(storeId: string, tenantId: string) {
    const rows = await db
      .select()
      .from(stores)
      .where(and(eq(stores.id, storeId), eq(stores.tenantId, tenantId)))
      .limit(1);
    return rows[0] ?? null;
  }

  async addStaff(input: { storeId: string; userId: string; roleCode: string }) {
    const rows = await db
      .insert(storeStaff)
      .values({
        storeId: input.storeId,
        userId: input.userId,
        roleCode: input.roleCode,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: [storeStaff.storeId, storeStaff.userId],
        set: { roleCode: input.roleCode, isActive: true },
      })
      .returning();

    return rows[0];
  }

  async listStaff(storeId: string) {
    return db.select().from(storeStaff).where(eq(storeStaff.storeId, storeId));
  }
}
