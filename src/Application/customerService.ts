import { CustomerRepository } from "@/Infrastructure/repositories/customerRepository";
import { writeAuditLog } from "@/Shared/audit";

const customerRepo = new CustomerRepository();

export class CustomerService {
  async getProfile(userId: string, tenantId: string) {
    return customerRepo.getProfile(userId, tenantId);
  }

  async updatePreferences(input: {
    userId: string;
    tenantId: string;
    preferences: Record<string, unknown>;
  }) {
    const customer = await customerRepo.getOrCreateByUserId(input.userId, input.tenantId);
    const updated = await customerRepo.updatePreferences(customer.id, input.preferences);

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.userId,
      action: "customer.preferences.update",
      resource: "customer",
      resourceId: customer.id,
      messageFa: "ترجیحات مشتری به‌روزرسانی شد",
    });

    return updated;
  }

  async addAddress(input: {
    userId: string;
    tenantId: string;
    province: string;
    city: string;
    line1: string;
    postalCode: string;
    isDefault?: boolean;
  }) {
    const customer = await customerRepo.getOrCreateByUserId(input.userId, input.tenantId);
    const address = await customerRepo.addAddress({
      customerId: customer.id,
      province: input.province,
      city: input.city,
      line1: input.line1,
      postalCode: input.postalCode,
      isDefault: input.isDefault,
    });

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.userId,
      action: "customer.address.create",
      resource: "customer_address",
      resourceId: address.id,
      messageFa: "آدرس جدید برای مشتری ثبت شد",
    });

    return address;
  }

  async trackActivity(input: {
    userId?: string;
    tenantId?: string;
    type: "login" | "search" | "product_view" | "add_to_cart" | "purchase" | "review" | "interaction";
    meta?: Record<string, unknown>;
  }) {
    let customerId: string | null = null;

    if (input.userId && input.tenantId) {
      const customer = await customerRepo.getOrCreateByUserId(input.userId, input.tenantId);
      customerId = customer.id;
    }

    return customerRepo.addActivity({ customerId, type: input.type, meta: input.meta });
  }

  async listActivities(tenantId: string, customerId?: string) {
    return customerRepo.listActivitiesByTenant(tenantId, customerId);
  }
}

export const customerService = new CustomerService();
