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
    <article className="surface card-hover overflow-hidden">
      <div
        className="relative aspect-[4/3] bg-cover bg-center"
        style={{ backgroundImage: "url('/heritage/atelier-candle.jpg')" }}
      >
        <span className="absolute left-3 top-3 flame" aria-hidden="true" />
      </div>
      <div className="p-4">
        <h3 className="display text-2xl">{product.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <RatingStars value={product.rating} />
          <InventoryStatus stock={product.stock} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <PriceTag price={product.price} discount={product.discountPercent} />
          <Link href={`/products/${product.id}`} className="btn-primary text-sm">
            روشن کن
          </Link>
        </div>
      </div>
    </article>
  );
}
