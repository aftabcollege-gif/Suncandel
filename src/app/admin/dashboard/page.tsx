import { AppShell } from "@/layouts/AppShell";
import { AdminControlCenter } from "@/features/portal/AdminControlCenter";

export default function AdminDashboardPage() {
  return (
    <AppShell>
      <AdminControlCenter />
    </AppShell>
  );
}
