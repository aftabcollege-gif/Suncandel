import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { crmInteractions } from "@/db/schema";

export class CrmRepository {
  async createInteraction(input: {
    tenantId: string;
    customerId: string;
    actorUserId?: string | null;
    channel: string;
    subject: string;
    detail: string;
    metadata?: Record<string, unknown>;
  }) {
    const rows = await db
      .insert(crmInteractions)
      .values({
        tenantId: input.tenantId,
        customerId: input.customerId,
        actorUserId: input.actorUserId ?? null,
        channel: input.channel,
        subject: input.subject,
        detail: input.detail,
        metadata: input.metadata ?? {},
      })
      .returning();

    return rows[0];
  }

  async listInteractions(tenantId: string, customerId?: string) {
    if (customerId) {
      return db
        .select()
        .from(crmInteractions)
        .where(and(eq(crmInteractions.tenantId, tenantId), eq(crmInteractions.customerId, customerId)))
        .orderBy(desc(crmInteractions.createdAt));
    }

    return db
      .select()
      .from(crmInteractions)
      .where(eq(crmInteractions.tenantId, tenantId))
      .orderBy(desc(crmInteractions.createdAt));
  }
}
