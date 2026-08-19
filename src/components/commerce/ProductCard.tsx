import Image from "next/image";
import Link from "next/link";
import type { Candle } from "@/data/candles";
import { PriceTag } from "@/components/commerce/PriceTag";

export type ProductCardModel = Candle;

export function ProductCard({ product }: { product: Candle }) {
  return (
    <article>
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#121a16]">
          <Image src={product.image} alt={product.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
        </div>
        <div className="pt-4">
          <h3 className="display text-2xl text-[#f4f1ea]">{product.title}</h3>
          <p className="mt-1 text-sm text-[#dce4dc]">{product.scent}</p>
          <p className="mt-1 text-sm text-[#dce4dc]">
            {product.burnHours} ساعت سوخت · {product.weight}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <PriceTag price={product.price} discount={product.discountPercent} />
            <span className="btn-primary text-xs">خرید</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
