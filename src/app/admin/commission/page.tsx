import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminCommissionPage() {
  return (
    <AppShell>
      <PortalSection
        title="Commission Management"
        subtitle="تعریف و نظارت بر کمیسیون فروشندگان و تسویه‌ها"
        columns={["Vendor", "GMV", "Rate", "Commission"]}
        rows={[["Candle Lab", "29M", "12%", "3.48M"], ["Party Craft", "12M", "10%", "1.2M"]]}
      />
    </AppShell>
  );
}
