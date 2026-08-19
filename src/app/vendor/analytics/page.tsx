import { AppShell } from "@/layouts/AppShell";
import { AnalyticsWidget, DashboardCard } from "@/components/data/DataWidgets";

export default function VendorAnalyticsPage() {
  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard title="بازدید محصول" value="۱۲,۴۰۰" hint="۷ روز اخیر" />
        <DashboardCard title="افزودن به سبد" value="۱,۹۸۰" hint="نرخ ۱۵.۹٪" />
        <DashboardCard title="تبدیل خرید" value="۳.۹٪" hint="بهبود نسبت به هفته قبل" />
      </div>
      <AnalyticsWidget title="ترند درآمد ماهانه" data={[18, 23, 35, 33, 42, 46, 51]} />
    </AppShell>
  );
}
