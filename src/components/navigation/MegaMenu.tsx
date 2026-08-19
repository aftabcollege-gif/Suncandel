export function MegaMenu() {
  const cols = [
    ["شمع دست‌ساز", "شمع معطر", "شمع تزئینی"],
    ["لوازم تولد", "لوازم جشن", "بسته‌بندی هدیه"],
    ["مواد اولیه کیک", "قالب قنادی", "ابزار شیرینی‌پزی"],
  ];

  return (
    <section className="surface mt-5 rounded-3xl p-5">
      <h2 className="text-sm font-semibold text-muted">دسته‌بندی‌های محبوب</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {cols.map((items, idx) => (
          <div key={idx} className="rounded-2xl border border-[var(--color-border)] p-4">
            <h3 className="mb-2 text-sm font-bold">گروه {idx + 1}</h3>
            <ul className="space-y-2 text-sm text-muted">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
