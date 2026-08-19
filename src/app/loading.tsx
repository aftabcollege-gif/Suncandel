export default function Loading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--color-background)] p-6">
      <div className="surface rounded-3xl p-8 text-center">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-[var(--color-border)] border-t-[var(--color-primary)]" />
        <p className="text-sm text-muted">در حال بارگذاری تجربه SUN...</p>
      </div>
    </main>
  );
}
