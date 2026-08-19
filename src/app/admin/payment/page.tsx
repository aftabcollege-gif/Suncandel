import { AppShell } from "@/layouts/AppShell";
import { PortalSection } from "@/features/portal/PortalSection";

export default function AdminPaymentPage() {
  return (
    <AppShell>
      <PortalSection
        title="Payment Control"
        subtitle="پایش تراکنش‌ها، callbackها و مغایرت پرداخت"
        columns={["Payment", "Gateway", "Amount", "Status"]}
        rows={[["P-90001", "mock-gateway", "1,540,000", "paid"], ["P-90000", "mock-gateway", "790,000", "failed"]]}
      />
    </AppShell>
  );
}
