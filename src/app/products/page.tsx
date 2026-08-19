import { AppShell } from "@/layouts/AppShell";
import { ProductDiscovery } from "@/features/customer/ProductDiscovery";

export default function ProductListingPage() {
  return (
    <AppShell>
      <ProductDiscovery />
    </AppShell>
  );
}
