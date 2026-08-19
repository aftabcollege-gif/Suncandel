import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminOrdersPage() {
  return (
    <AppShell>
      <PortalSection
        title="Order Management"
        subtitle="پایش وضعیت سفارش، SLA ارسال و کیفیت عملیات"
        columns={["Order", "Store", "مبلغ", "وضعیت"]}
        rows={[["SUN-10911", "Candle Lab", "1,540,000", "processing"], ["SUN-10910", "Party Craft", "890,000", "shipping"]]}
      />
    </AppShell>
  );
}
