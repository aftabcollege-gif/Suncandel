import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminStoresPage() {
  return (
    <AppShell>
      <PortalSection
        title="Store Management"
        subtitle="کنترل Theme، Domain، Brand Kit و تنظیمات فروشگاه"
        columns={["Store", "Domain", "Theme", "Status"]}
        rows={[["Candle Lab", "store1.sun.ir", "Glass", "Active"], ["Party Craft", "store2.sun.ir", "Spatial", "Active"]]}
      />
    </AppShell>
  );
}
