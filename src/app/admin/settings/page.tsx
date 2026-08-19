import { AppShell } from "@/layouts/AppShell";
import { DataTable } from "@/components/data/DataWidgets";

export default function AdminSettingsPage() {
  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">تنظیمات سیستم</h2>
        <p className="text-sm text-muted">پیکربندی‌های Tenant، امنیت و تنظیمات سراسری</p>
      </section>
      <DataTable
        columns={["کلید", "مقدار"]}
        rows={[
          ["platform.default_currency", "IRR"],
          ["auth.access_ttl", "15m"],
          ["auth.refresh_ttl", "30d"],
        ]}
      />
    </AppShell>
  );
}
