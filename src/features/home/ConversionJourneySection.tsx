const steps = [
  "کشف محصول با جستجوی هوشمند",
  "بررسی تجربه 3D و نظرات مشتریان",
  "افزودن به سبد + پیشنهاد مکمل",
  "تسویه‌حساب امن و رهگیری سفارش",
];

export function ConversionJourneySection() {
  return (
    <section className="surface rounded-3xl p-6 md:p-8">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h3 className="text-2xl font-bold">Flow تبدیل با تمرکز بر تصمیم خرید سریع</h3>
          <p className="mt-2 text-sm text-muted">
            چیدمان صفحه با رویکرد Conversion-first طراحی شده: کشف سریع، اعتمادسازی، مقایسه، و CTAهای واضح.
          </p>
          <div className="mt-4 space-y-2">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] p-3 text-sm">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-background)] text-xs">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
        <aside className="surface-soft rounded-2xl p-4">
          <h4 className="font-bold">Trust Indicators</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>✅ پرداخت امن و تاییدشده</li>
            <li>✅ تضمین اصالت محصولات دست‌ساز</li>
            <li>✅ ارسال رهگیری‌پذیر سراسری</li>
            <li>✅ پشتیبانی ۷ روز هفته</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
