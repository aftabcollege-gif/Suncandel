export function RatingStars({ value }: { value: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <div aria-label={`امتیاز ${rounded} از 5`} className="flex items-center gap-1 text-xs">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rounded ? "text-[var(--color-warning)]" : "text-[var(--color-border)]"}>★</span>
      ))}
    </div>
  );
}
