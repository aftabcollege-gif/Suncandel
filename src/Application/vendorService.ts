import { AppError } from "@/Shared/errors";
import { VendorRepository } from "@/Infrastructure/repositories/vendorRepository";
import { writeAuditLog } from "@/Shared/audit";

const vendorRepo = new VendorRepository();

export class VendorService {
  async createVendor(input: {
    tenantId: string;
    ownerUserId: string;
    legalName: string;
    nationalId: string;
    businessInfo?: Record<string, unknown>;
    financialInfo?: Record<string, unknown>;
  }) {
    const vendor = await vendorRepo.createVendor(input);

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.ownerUserId,
      action: "vendor.create",
      resource: "vendor",
      resourceId: vendor.id,
      messageFa: `فروشنده ${vendor.legalName} ایجاد شد`,
    });

    return vendor;
  }

  async listVendors(tenantId: string) {
    return vendorRepo.listVendorsByTenant(tenantId);
  }

  async createStore(input: {
    tenantId: string;
    vendorId: string;
    actorUserId: string;
    name: string;
    slug: string;
    settings?: Record<string, unknown>;
  }) {
    const vendor = await vendorRepo.findVendorById(input.vendorId, input.tenantId);
    if (!vendor) {
      throw new AppError("فروشنده یافت نشد", 404, "VENDOR_NOT_FOUND");
    }

    const store = await vendorRepo.createStore(input);

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      action: "store.create",
      resource: "store",
      resourceId: store.id,
      messageFa: `فروشگاه ${store.name} ایجاد شد`,
    });

    return store;
  }

  async listStores(tenantId: string, vendorId: string) {
    return vendorRepo.listStores(vendorId, tenantId);
  }

  async addStaff(input: {
    tenantId: string;
    actorUserId: string;
    storeId: string;
    userId: string;
    roleCode: string;
  }) {
    const store = await vendorRepo.findStoreById(input.storeId, input.tenantId);
    if (!store) {
      throw new AppError("فروشگاه یافت نشد", 404, "STORE_NOT_FOUND");
    }

    const staff = await vendorRepo.addStaff({
      storeId: input.storeId,
      userId: input.userId,
      roleCode: input.roleCode,
    });

    await writeAuditLog({
      tenantId: input.tenantId,
      actorUserId: input.actorUserId,
      action: "store.staff.upsert",
      resource: "store_staff",
      resourceId: staff.id,
      messageFa: `کاربر به‌عنوان ${staff.roleCode} به پرسنل فروشگاه افزوده شد`,
    });

    return staff;
  }

  async listStaff(tenantId: string, storeId: string) {
    const store = await vendorRepo.findStoreById(storeId, tenantId);
    if (!store) {
      throw new AppError("فروشگاه یافت نشد", 404, "STORE_NOT_FOUND");
    }

    return vendorRepo.listStaff(storeId);
  }
}

export const vendorService = new VendorService();
