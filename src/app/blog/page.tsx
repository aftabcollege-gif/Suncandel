import { AppShell } from "@/layouts/AppShell";

export default function BlogPage() {
  const posts = [
    { title: "۵ روش افزایش فروش محصولات دست‌ساز", date: "۱۴۰۵/۰۲/۱۸" },
    { title: "راهنمای عکاسی حرفه‌ای محصول برای فروش آنلاین", date: "۱۴۰۵/۰۲/۱۰" },
    { title: "ترندهای جشن و تولد در سال جدید", date: "۱۴۰۵/۰۱/۲۴" },
  ];

  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">بلاگ SUN</h2>
        <div className="mt-4 space-y-3">
          {posts.map((post) => (
            <article key={post.title} className="rounded-2xl border border-[var(--color-border)] p-4">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="mt-1 text-xs text-muted">{post.date}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
