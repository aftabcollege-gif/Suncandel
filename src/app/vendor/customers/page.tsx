import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function VendorCustomersPage() {
  return (
    <AppShell>
      <PortalSection
        title="مشتریان فروشگاه"
        subtitle="مدیریت مشتریان، خریدهای اخیر و فرصت‌های تعامل"
        columns={["مشتری", "آخرین خرید", "سفارشات", "Segment"]}
        rows={[["مریم جعفری", "۲ روز پیش", "12", "VIP"], ["سارا موسوی", "۵ روز پیش", "4", "Active"]]}
      />
    </AppShell>
  );
}
