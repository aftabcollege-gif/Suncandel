import Image from "next/image";
import Link from "next/link";
import { InventoryStatus } from "@/components/commerce/InventoryStatus";
import { PriceTag } from "@/components/commerce/PriceTag";
import { RatingStars } from "@/components/commerce/RatingStars";

export type ProductCardModel = {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercent?: number;
  stock: number;
  rating: number;
};

const covers: Record<string, string> = {
  p1: "/heritage/stage-scent.jpg",
  p2: "/heritage/stage-finish.jpg",
  p3: "/heritage/atelier-candle.jpg",
  p4: "/heritage/stage-pour.jpg",
};

export function ProductCard({ product }: { product: ProductCardModel }) {
  const src = covers[product.id] ?? "/heritage/stage-finish.jpg";
  return (
    <article className="card-hover border border-[var(--color-border)] bg-[#0d1611]">
      <div className="relative aspect-[5/4] overflow-hidden">
        <Image src={src} alt={product.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
      </div>
      <div className="space-y-3 p-5">
        <h3 className="display text-2xl text-[#f5f2e8]">{product.title}</h3>
        <p className="max-w-[40ch] text-sm leading-7 text-[#d7e0d6]">{product.description}</p>
        <div className="flex items-center justify-between">
          <RatingStars value={product.rating} />
          <InventoryStatus stock={product.stock} />
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <PriceTag price={product.price} discount={product.discountPercent} />
          <Link href={`/products/${product.id}`} className="btn-primary text-xs">
            انتخاب
          </Link>
        </div>
      </div>
    </article>
  );
}
