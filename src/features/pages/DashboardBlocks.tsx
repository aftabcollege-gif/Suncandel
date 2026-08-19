import { AnalyticsWidget, DashboardCard, DataTable, Timeline } from "@/components/data/DataWidgets";

export function DashboardBlocks({ title }: { title: string }) {
  return (
    <div className="space-y-5">
      <section className="surface rounded-3xl p-5">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted">نمای کلیدی عملکرد، سفارش‌ها و تعاملات مشتری</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="فروش امروز" value="۲۴,۵۰۰,۰۰۰" hint="+۱۲٪ نسبت به دیروز" />
        <DashboardCard title="سفارشات" value="۱۸۷" hint="۷ سفارش در انتظار ارسال" />
        <DashboardCard title="نرخ تبدیل" value="۳.۸٪" hint="بهبود با تم شخصی‌سازی‌شده" />
        <DashboardCard title="رضایت مشتری" value="۹۱٪" hint="بر اساس ۲۸۹ بازخورد" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnalyticsWidget title="روند فروش هفتگی" data={[12, 22, 17, 26, 31, 24, 36]} />
        <Timeline
          events={[
            { time: "۱۰:۲۱", label: "سفارش SUN-ORD-001 تایید شد" },
            { time: "۱۰:۵۸", label: "موجودی محصول شمع رز کاهش یافت" },
            { time: "۱۱:۳۳", label: "تعامل جدید CRM ثبت شد" },
          ]}
        />
      </div>

      <DataTable
        columns={["سفارش", "مشتری", "مبلغ", "وضعیت"]}
        rows={[
          ["SUN-7842", "مریم جعفری", "۱,۲۹۰,۰۰۰", "پرداخت‌شده"],
          ["SUN-7841", "رضا افشار", "۸۹۰,۰۰۰", "در حال پردازش"],
          ["SUN-7840", "نگین سلیمی", "۲,۱۴۰,۰۰۰", "ارسال‌شده"],
        ]}
      />
    </div>
  );
}
