import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminVendorsPage() {
  return (
    <AppShell>
      <PortalSection
        title="Vendor Management"
        subtitle="مدیریت فروشندگان، وضعیت تایید و عملکرد"
        columns={["فروشنده", "وضعیت", "فروش ۳۰ روزه", "ریسک"]}
        rows={[["Candle Lab", "تایید شده", "۲۹M", "کم"], ["Party Craft", "در انتظار", "۵M", "متوسط"]]}
      />
    </AppShell>
  );
}
