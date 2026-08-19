import { AnalyticsWidget, DataTable, DashboardCard } from "@/components/data/DataWidgets";

export function VendorBrandCockpit() {
  return (
    <div className="space-y-5">
      <section className="surface rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.08em] text-muted">Vendor Performance Cockpit</p>
        <h2 className="mt-2 text-3xl font-bold">Brand Revenue & Growth Studio</h2>
        <p className="mt-2 text-sm text-muted">پایش فروش، موجودی، رفتار مشتری و پیشنهادات AI برای رشد فروشگاه.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="فروش ۳۰ روزه" value="۲۹,۴۰۰,۰۰۰" hint="رشد ۱۴٪" />
        <DashboardCard title="سفارشات باز" value="۳۴" hint="۸ نیازمند ارسال" />
        <DashboardCard title="نرخ تبدیل" value="۴.۱٪" hint="بهبود با Storytelling" />
        <DashboardCard title="موجودی بحرانی" value="۵ SKU" hint="Reorder پیشنهادی فعال" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnalyticsWidget title="روند فروش هفتگی برند" data={[8, 14, 11, 19, 21, 24, 27]} />
        <DataTable
          columns={["محصول", "Stock", "Demand", "Action"]}
          rows={[
            ["شمع رز", "4", "High", "Reorder"],
            ["ست جشن", "7", "Medium", "Promo"],
            ["باکس هدیه", "15", "Low", "Bundle"],
          ]}
        />
      </div>
    </div>
  );
}
