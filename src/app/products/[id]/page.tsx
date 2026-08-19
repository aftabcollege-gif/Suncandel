import { AppShell } from "@/layouts/AppShell";
import { InventoryStatus } from "@/components/commerce/InventoryStatus";
import { PriceTag } from "@/components/commerce/PriceTag";
import { RatingStars } from "@/components/commerce/RatingStars";
import { Product3DViewerLazy } from "@/components/experience/Product3DViewerLazy";
import { PurchaseDecisionSupport } from "@/features/product/PurchaseDecisionSupport";

type Params = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Params) {
  const { id } = await params;
  return (
    <AppShell>
      <section className="surface grid gap-6 rounded-3xl p-6 lg:grid-cols-2">
        <div className="aspect-square rounded-3xl bg-gradient-to-tr from-[var(--color-secondary)]/25 to-[var(--color-accent)]/30" />
        <div>
          <p className="text-xs text-muted">شناسه محصول: {id}</p>
          <h2 className="mt-2 text-2xl font-bold">شمع دست‌ساز پریمیوم مدل SUN-{id}</h2>
          <p className="mt-3 text-sm text-muted">
            طراحی شده برای دکور لاکچری و مناسب هدیه با بسته‌بندی اختصاصی فروشنده.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <RatingStars value={5} />
            <InventoryStatus stock={9} />
          </div>
          <div className="mt-4">
            <PriceTag price={560000} discount={14} />
          </div>
          <button className="btn-primary mt-6">افزودن به سبد</button>
        </div>
      </section>

      <Product3DViewerLazy />
      <PurchaseDecisionSupport />
    </AppShell>
  );
}
