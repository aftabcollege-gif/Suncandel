import { AppShell } from "@/layouts/AppShell";
import { DataTable } from "@/components/data/DataWidgets";

export default function VendorStorePage() {
  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">تنظیمات فروشگاه فروشنده</h2>
        <p className="text-sm text-muted">مدیریت اطلاعات فروشگاه، تم اختصاصی و وضعیت فعالیت</p>
      </section>
      <DataTable
        columns={["پارامتر", "مقدار"]}
        rows={[
          ["نام فروشگاه", "SUN CANDLE ART"],
          ["تم فعال", "Glassmorphism"],
          ["وضعیت", "فعال"],
        ]}
      />
    </AppShell>
  );
}
