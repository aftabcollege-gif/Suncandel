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
    <article className="surface card-hover rounded-3xl p-4">
      <div className="mb-3 aspect-[4/3] rounded-2xl bg-gradient-to-tr from-[var(--color-secondary)]/25 to-[var(--color-accent)]/25" />
      <h3 className="text-base font-bold">{product.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <RatingStars value={product.rating} />
        <InventoryStatus stock={product.stock} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <PriceTag price={product.price} discount={product.discountPercent} />
        <Link href={`/products/${product.id}`} className="btn-primary text-sm">مشاهده</Link>
      </div>
    </article>
  );
}
