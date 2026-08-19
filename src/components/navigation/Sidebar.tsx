import Link from "next/link";

const links = [
  { href: "/vendor/dashboard", label: "داشبورد فروشنده" },
  { href: "/vendor/products", label: "محصولات" },
  { href: "/vendor/orders", label: "سفارش‌ها" },
  { href: "/admin/dashboard", label: "داشبورد ادمین" },
  { href: "/admin/products", label: "کاتالوگ" },
  { href: "/admin/orders", label: "سفارش‌ها" },
  { href: "/admin/settings", label: "تنظیمات" },
];

export function Sidebar() {
  return (
    <aside className="hidden h-fit border border-[var(--color-border)] bg-[#0b1410] p-4 lg:block">
      <p className="kicker mb-4">panel</p>
      <ul className="space-y-1">
        {links.map((item) => (
          <li key={item.href}>
            <Link className="block px-3 py-2 text-sm hover:bg-[#163326] hover:text-[var(--color-primary)]" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
