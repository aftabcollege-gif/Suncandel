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

export function ProductCard({ product }: { product: ProductCardModel }) {
  return (
    <article className="card-hover border border-[var(--color-border)] bg-[#0b1410]">
      <div className="relative aspect-[4/5] bg-gradient-to-b from-[#163326] to-[#050705]">
        <span className="absolute left-1/2 top-1/2 h-28 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f2e2b8] shadow-[0_-18px_40px_rgba(212,175,55,0.35)]" />
        <span className="flame absolute left-1/2 top-[18%] -translate-x-1/2" />
      </div>
      <div className="space-y-3 p-5">
        <h3 className="display text-2xl">{product.title}</h3>
        <p className="line-clamp-2 text-sm text-muted">{product.description}</p>
        <div className="flex items-center justify-between">
          <RatingStars value={product.rating} />
          <InventoryStatus stock={product.stock} />
        </div>
        <div className="flex items-center justify-between gap-3 pt-2">
          <PriceTag price={product.price} discount={product.discountPercent} />
          <Link href={`/products/${product.id}`} className="btn-primary text-xs">انتخاب</Link>
        </div>
      </div>
    </article>
  );
}
