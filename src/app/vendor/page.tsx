import { AppShell } from "@/layouts/AppShell";
import { DashboardBlocks } from "@/features/pages/DashboardBlocks";

export default function VendorRootPage() {
  return (
    <AppShell>
      <DashboardBlocks title="Vendor Enterprise Portal" />
    </AppShell>
  );
}
