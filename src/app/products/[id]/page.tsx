import Image from "next/image";
import { AppShell } from "@/layouts/AppShell";
import { PriceTag } from "@/components/commerce/PriceTag";
import { InventoryStatus } from "@/components/commerce/InventoryStatus";
import { Product3DViewerLazy } from "@/components/experience/Product3DViewerLazy";
import { getCandle } from "@/data/candles";

type Params = { params: Promise<{ id: string }> };

export default async function ProductDetailPage({ params }: Params) {
  const { id } = await params;
  const candle = getCandle(id);

  return (
    <AppShell>
      <section className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] bg-[#121a16]">
          <Image src={candle.image} alt={candle.title} fill sizes="50vw" className="object-cover" />
        </div>
        <div>
          <h1 className="display text-4xl text-[#f4f1ea] md:text-5xl">{candle.title}</h1>
          <p className="mt-4 max-w-[40ch] text-[1.05rem] leading-8 text-[#dce4dc]">{candle.description}</p>
          <dl className="mt-8 space-y-2 text-[#dce4dc]">
            <div>رایحه: {candle.scent}</div>
            <div>نت‌ها: {candle.notes}</div>
            <div>زمان سوخت: {candle.burnHours} ساعت</div>
            <div>وزن: {candle.weight}</div>
          </dl>
          <div className="mt-6 flex items-center gap-4">
            <PriceTag price={candle.price} discount={candle.discountPercent} />
            <InventoryStatus stock={candle.stock} />
          </div>
          <button className="btn-primary mt-8">افزودن به سبد</button>
        </div>
      </section>
      <div className="mt-16">
        <h2 className="display mb-4 text-3xl">نمای سه‌بعدی</h2>
        <Product3DViewerLazy />
      </div>
    </AppShell>
  );
}
