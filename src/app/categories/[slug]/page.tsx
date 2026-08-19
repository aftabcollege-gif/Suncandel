import { AppShell } from "@/layouts/AppShell";
import { ProductCard } from "@/components/commerce/ProductCard";
import { candles } from "@/data/candles";

type Params = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;

  return (
    <AppShell>
      <h1 className="display text-4xl text-[#f4f1ea]">دسته {slug}</h1>
      <section className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {candles.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </section>
    </AppShell>
  );
}
