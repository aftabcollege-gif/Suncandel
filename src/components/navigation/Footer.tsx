export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/80">
      <div className="container-main grid gap-6 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-sm font-bold">SUN</h3>
          <p className="mt-2 text-sm text-muted">پلتفرم Social Commerce چندفروشندگی برای بازار ایران</p>
        </div>
        <div>
          <h3 className="text-sm font-bold">راهنما</h3>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            <li>پرسش‌های متداول</li>
            <li>مرکز راهنما</li>
            <li>قوانین و حریم خصوصی</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-bold">اعتماد</h3>
          <p className="mt-2 text-sm text-muted">پرداخت امن، ارسال قابل رهگیری، پشتیبانی ۷ روز هفته</p>
        </div>
      </div>
    </footer>
  );
}
