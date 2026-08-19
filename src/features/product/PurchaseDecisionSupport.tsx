import { RatingStars } from "@/components/commerce/RatingStars";

const reviews = [
  { user: "الهام", text: "کیفیت ساخت عالی بود و رایحه دقیقاً همون چیزی بود که می‌خواستم.", rating: 5 },
  { user: "رضا", text: "بسته‌بندی لوکس و مناسب هدیه. ارسال هم به‌موقع بود.", rating: 4 },
];

const recommendations = [
  "ست فیتیله و ابزار نگهداری شمع",
  "باکس هدیه اختصاصی طلایی",
  "اسانس مکمل رایحه اسطوخودوس",
];

export function PurchaseDecisionSupport() {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="surface rounded-3xl p-4 lg:col-span-2">
        <h3 className="text-lg font-bold">بازخورد مشتریان</h3>
        <div className="mt-3 space-y-3">
          {reviews.map((review) => (
            <div key={review.user} className="rounded-2xl border border-[var(--color-border)] p-3">
              <div className="mb-1 flex items-center justify-between">
                <strong className="text-sm">{review.user}</strong>
                <RatingStars value={review.rating} />
              </div>
              <p className="text-sm text-muted">{review.text}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="surface rounded-3xl p-4">
        <h3 className="text-lg font-bold">پیشنهاد مکمل</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {recommendations.map((r) => (
            <li key={r}>• {r}</li>
          ))}
        </ul>
        <button className="btn-primary mt-4 w-full">افزودن باندل پیشنهادی</button>
      </article>
    </section>
  );
}
