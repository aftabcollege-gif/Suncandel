import { db } from "@/db";
import { auditLogs } from "@/db/schema";

export async function writeAuditLog(input: {
  tenantId?: string | null;
  actorUserId?: string | null;
  action: string;
  resource: string;
  resourceId: string;
  messageFa: string;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(auditLogs).values({
    tenantId: input.tenantId ?? null,
    actorUserId: input.actorUserId ?? null,
    action: input.action,
    resource: input.resource,
    resourceId: input.resourceId,
    messageFa: input.messageFa,
    metadata: input.metadata ?? {},
  });
}
