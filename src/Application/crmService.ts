import { CrmRepository } from "@/Infrastructure/repositories/crmRepository";
import { writeAuditLog } from "@/Shared/audit";

const crmRepo = new CrmRepository();

export class CrmService {
  async createInteraction(input: {
    tenantId: string;
    customerId: string;
    actorUserId: string;
    channel: string;
    subject: string;
    detail: string;
    metadata?: Record<string, unknown>;
  }) {
    const interaction = await crmRepo.createInteraction(input);

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      action: "crm.interaction.create",
      resource: "crm_interaction",
      resourceId: interaction.id,
      messageFa: `تعامل CRM با موضوع «${interaction.subject}» ثبت شد`,
    });

    return interaction;
  }

  async listInteractions(tenantId: string, customerId?: string) {
    return crmRepo.listInteractions(tenantId, customerId);
  }
}

export const crmService = new CrmService();
