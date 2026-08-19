import { AppShell } from "@/layouts/AppShell";
import { DataTable, Timeline } from "@/components/data/DataWidgets";

export default function VendorOrdersPage() {
  return (
    <AppShell>
      <section className="grid gap-4 lg:grid-cols-2">
        <DataTable
          columns={["شماره سفارش", "مبلغ", "وضعیت", "زمان"]}
          rows={[
            ["SUN-8001", "۱,۲۵۰,۰۰۰", "processing", "۱۰:۳۵"],
            ["SUN-7998", "۹۸۰,۰۰۰", "shipping", "۰۹:۵۰"],
            ["SUN-7992", "۱,۷۱۰,۰۰۰", "completed", "دیروز"],
          ]}
        />
        <Timeline
          events={[
            { time: "۱۰:۳۶", label: "وضعیت سفارش SUN-8001 به processing تغییر کرد" },
            { time: "۱۰:۴۰", label: "فاکتور سفارش SUN-8001 تولید شد" },
            { time: "۱۰:۴۵", label: "اعلان پیامکی برای مشتری ارسال شد" },
          ]}
        />
      </section>
    </AppShell>
  );
}
