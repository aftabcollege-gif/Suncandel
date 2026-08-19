import { AnalyticsWidget, DataTable, DashboardCard, Timeline } from "@/components/data/DataWidgets";

export function AdminControlCenter() {
  return (
    <div className="space-y-5">
      <section className="surface rounded-3xl p-6">
        <p className="text-xs uppercase tracking-[0.08em] text-muted">Enterprise Control Center</p>
        <h2 className="mt-2 text-3xl font-bold">SUN Admin Command Bridge</h2>
        <p className="mt-2 text-sm text-muted">نظارت لحظه‌ای بر فروشندگان، سفارشات، پرداخت، AI و ریسک‌های عملیاتی.</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="GMV امروز" value="۴۲,۸۰۰,۰۰۰" hint="+۱۸٪ نسبت به دیروز" />
        <DashboardCard title="فروشندگان فعال" value="۸۹" hint="۳ فروشنده جدید در ۲۴ ساعت" />
        <DashboardCard title="ریسک پرداخت" value="۱.۲٪" hint="۴ callback نیازمند بررسی" />
        <DashboardCard title="AI Inference" value="۱۲,۴۴۰" hint="P95: 210ms" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnalyticsWidget title="توزیع درآمد فروشگاه‌ها" data={[42, 31, 25, 19, 14, 11, 8]} />
        <Timeline
          events={[
            { time: "11:20", label: "هشدار ریسک callback پرداخت ثبت شد" },
            { time: "11:16", label: "Vendor Candle Lab به وضعیت verified رفت" },
            { time: "11:05", label: "AI pipeline recommendation_refresh اجرا شد" },
          ]}
        />
      </div>

      <DataTable
        columns={["Module", "Status", "Owner", "Action"]}
        rows={[
          ["Payment", "warning", "Ops", "Reconcile"],
          ["AI Search", "healthy", "AI Team", "Monitor"],
          ["Store Themes", "healthy", "DesignOps", "Publish"],
        ]}
      />
    </div>
  );
}
