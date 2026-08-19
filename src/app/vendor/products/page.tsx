import { AppShell } from "@/layouts/AppShell";
import { DataTable } from "@/components/data/DataWidgets";

export default function VendorProductsPage() {
  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">مدیریت محصولات فروشنده</h2>
        <p className="text-sm text-muted">افزودن، ویرایش، قیمت‌گذاری و مدیریت موجودی</p>
      </section>
      <DataTable
        columns={["محصول", "SKU", "قیمت", "موجودی", "وضعیت"]}
        rows={[
          ["شمع رز", "SUN-RS-01", "۳۹۰,۰۰۰", "۱۸", "منتشرشده"],
          ["ست تولد", "SUN-BD-12", "۷۱۰,۰۰۰", "۶", "منتشرشده"],
          ["ابزار قنادی", "SUN-CK-44", "۲۹۰,۰۰۰", "۰", "پیش‌نویس"],
        ]}
      />
    </AppShell>
  );
}
