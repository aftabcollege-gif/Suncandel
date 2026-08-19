import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminAuditPage() {
  return (
    <AppShell>
      <PortalSection
        title="Audit Logs"
        subtitle="ثبت و مشاهده اقدامات حساس سیستم و کاربران"
        columns={["زمان", "Actor", "Action", "Result"]}
        rows={[["11:45", "admin", "payment.callback", "success"], ["11:42", "vendor", "product.create", "success"]]}
      />
    </AppShell>
  );
}
