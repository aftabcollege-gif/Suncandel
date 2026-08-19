import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminAIControlPage() {
  return (
    <AppShell>
      <PortalSection
        title="AI Control Center"
        subtitle="مدیریت مدل‌ها، fallback، خطاها و کیفیت پیشنهادات"
        columns={["Model", "Provider", "Version", "Status"]}
        rows={[["recommendation-hybrid", "rule-based-local", "1.0.0", "active"], ["semantic-search", "rule-based-local", "1.0.0", "active"]]}
      />
    </AppShell>
  );
}
