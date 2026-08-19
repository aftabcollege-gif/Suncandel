import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminProductsPage() {
  return (
    <AppShell>
      <PortalSection
        title="Product Management"
        subtitle="نظارت بر کاتالوگ، قیمت‌گذاری و کیفیت محتوای کالا"
        columns={["محصول", "Store", "وضعیت", "امتیاز کیفیت"]}
        rows={[["شمع رز", "Candle Lab", "Published", "91"], ["ست جشن", "Party Craft", "Published", "87"]]}
      />
    </AppShell>
  );
}
