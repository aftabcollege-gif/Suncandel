import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminCustomersPage() {
  return (
    <AppShell>
      <PortalSection
        title="Customer Management"
        subtitle="پروفایل مشتریان، segmentها و رفتار خرید"
        columns={["Customer", "Segment", "LTV", "Churn Risk"]}
        rows={[["مریم جعفری", "VIP", "8.2M", "Low"], ["ندا صادقی", "Active", "2.1M", "Medium"]]}
      />
    </AppShell>
  );
}
