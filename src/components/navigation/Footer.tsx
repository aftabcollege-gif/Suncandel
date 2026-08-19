import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#24332b] bg-[#0c1210]">
      <div className="container-main flex flex-col gap-6 py-12 md:flex-row md:justify-between">
        <p className="display text-2xl">SUN</p>
        <div className="flex gap-6 text-sm text-[#dce4dc]">
          <Link href="/products">کالکشن</Link>
          <Link href="/faq">راهنما</Link>
          <Link href="/vendor/login">فروشنده</Link>
        </div>
      </div>
    </footer>
  );
}
