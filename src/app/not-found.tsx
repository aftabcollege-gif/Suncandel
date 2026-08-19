import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-background)] p-6">
      <section className="surface max-w-lg rounded-3xl p-8 text-center">
        <p className="text-sm text-muted">۴۰۴</p>
        <h1 className="mt-2 text-2xl font-bold">صفحه موردنظر پیدا نشد</h1>
        <p className="mt-2 text-sm text-muted">ممکن است لینک اشتباه باشد یا صفحه جابه‌جا شده باشد.</p>
        <Link href="/" className="btn-primary mt-5 inline-flex">بازگشت به خانه</Link>
      </section>
    </main>
  );
}
