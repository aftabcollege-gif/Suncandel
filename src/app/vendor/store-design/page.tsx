import { AppShell } from "@/layouts/AppShell";
import { ThemeShowcase } from "@/features/home/ThemeShowcase";

export default function VendorStoreDesignPage() {
  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">Store Design Studio</h2>
        <p className="mt-1 text-sm text-muted">برندینگ فروشگاه، انتخاب Theme، Motion و ظاهر کارت‌های محصول</p>
      </section>
      <ThemeShowcase />
    </AppShell>
  );
}
