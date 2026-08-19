import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { customerActivities, customerAddresses, customers, users } from "@/db/schema";

export class CustomerRepository {
  async getByUserId(userId: string, tenantId: string) {
    const rows = await db
      .select()
      .from(customers)
      .where(and(eq(customers.userId, userId), eq(customers.tenantId, tenantId)))
      .limit(1);
    return rows[0] ?? null;
  }

  async createForUser(userId: string, tenantId: string) {
    const rows = await db.insert(customers).values({ userId, tenantId, preferences: {} }).returning();
    return rows[0];
  }

  async getOrCreateByUserId(userId: string, tenantId: string) {
    const existing = await this.getByUserId(userId, tenantId);
    if (existing) return existing;
    return this.createForUser(userId, tenantId);
  }

  async getProfile(userId: string, tenantId: string) {
    const customer = await this.getOrCreateByUserId(userId, tenantId);
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const addresses = await db
      .select()
      .from(customerAddresses)
      .where(eq(customerAddresses.customerId, customer.id));

    return {
      customer,
      user: user[0] ?? null,
      addresses,
    };
  }

  async addAddress(input: {
    customerId: string;
    province: string;
    city: string;
    line1: string;
    postalCode: string;
    isDefault?: boolean;
  }) {
    if (input.isDefault) {
      await db
        .update(customerAddresses)
        .set({ isDefault: false })
        .where(eq(customerAddresses.customerId, input.customerId));
    }

    const rows = await db
      .insert(customerAddresses)
      .values({
        customerId: input.customerId,
        province: input.province,
        city: input.city,
        line1: input.line1,
        postalCode: input.postalCode,
        isDefault: input.isDefault ?? false,
      })
      .returning();

    return rows[0];
  }

  async updatePreferences(customerId: string, preferences: Record<string, unknown>) {
    const rows = await db
      .update(customers)
      .set({ preferences, updatedAt: new Date() })
      .where(eq(customers.id, customerId))
      .returning();

    return rows[0] ?? null;
  }

  async addActivity(input: {
    customerId?: string | null;
    type: "login" | "search" | "product_view" | "add_to_cart" | "purchase" | "review" | "interaction";
    meta?: Record<string, unknown>;
  }) {
    const rows = await db
      .insert(customerActivities)
      .values({
        customerId: input.customerId ?? null,
        type: input.type,
        meta: input.meta ?? {},
      })
      .returning();

    return rows[0];
  }

  async listActivitiesByTenant(tenantId: string, customerId?: string) {
    if (customerId) {
      return db
        .select({
          id: customerActivities.id,
          customerId: customerActivities.customerId,
          type: customerActivities.type,
          meta: customerActivities.meta,
          createdAt: customerActivities.createdAt,
        })
        .from(customerActivities)
        .innerJoin(customers, eq(customers.id, customerActivities.customerId))
        .where(and(eq(customers.tenantId, tenantId), eq(customerActivities.customerId, customerId)))
        .orderBy(desc(customerActivities.createdAt));
    }

    return db
      .select({
        id: customerActivities.id,
        customerId: customerActivities.customerId,
        type: customerActivities.type,
        meta: customerActivities.meta,
        createdAt: customerActivities.createdAt,
      })
      .from(customerActivities)
      .innerJoin(customers, eq(customers.id, customerActivities.customerId))
      .where(eq(customers.tenantId, tenantId))
      .orderBy(desc(customerActivities.createdAt));
  }
}
