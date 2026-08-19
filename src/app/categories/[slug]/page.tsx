import { AppShell } from "@/layouts/AppShell";
import { ProductCard } from "@/components/commerce/ProductCard";

type Params = { params: Promise<{ slug: string }> };

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const items = [
    { id: "c-1", title: `محصول ${slug} - ۱`, description: "گزینه محبوب مشتریان", price: 280000, stock: 13, rating: 4 },
    { id: "c-2", title: `محصول ${slug} - ۲`, description: "کیفیت صادراتی", price: 450000, stock: 5, rating: 5 },
  ];

  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">دسته‌بندی: {slug}</h2>
        <p className="text-sm text-muted">نمایش محصولات مرتبط با این گروه</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </section>
    </AppShell>
  );
}
