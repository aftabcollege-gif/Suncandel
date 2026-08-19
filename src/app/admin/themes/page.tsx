import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminThemesPage() {
  return (
    <AppShell>
      <PortalSection
        title="Theme Management"
        subtitle="مدیریت ۶ تم سازمانی و تخصیص Theme به Storeها"
        columns={["Theme", "Store Usage", "Motion", "Status"]}
        rows={[["Minimalism", "27", "Smooth", "Active"], ["Spatial", "11", "Dynamic", "Active"]]}
      />
    </AppShell>
  );
}
