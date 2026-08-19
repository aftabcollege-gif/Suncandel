import Link from "next/link";

const links = [
  { href: "/vendor", label: "🎯 Vendor Home" },
  { href: "/vendor/dashboard", label: "داشبورد فروشنده" },
  { href: "/vendor/products", label: "مدیریت محصولات" },
  { href: "/vendor/orders", label: "مدیریت سفارشات" },
  { href: "/vendor/customers", label: "مشتریان" },
  { href: "/vendor/analytics", label: "تحلیل فروش" },
  { href: "/vendor/store-design", label: "طراحی فروشگاه" },
  { href: "/vendor/ai-assistant", label: "دستیار AI فروشنده" },
  { href: "/admin/dashboard", label: "🛡️ Admin Dashboard" },
  { href: "/admin/vendors", label: "Vendor Management" },
  { href: "/admin/stores", label: "Store Management" },
  { href: "/admin/products", label: "Product Management" },
  { href: "/admin/orders", label: "Order Management" },
  { href: "/admin/customers", label: "Customer Management" },
  { href: "/admin/crm", label: "CRM" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/payment", label: "Payment" },
  { href: "/admin/commission", label: "Commission" },
  { href: "/admin/themes", label: "Theme Management" },
  { href: "/admin/ai-control", label: "AI Control Center" },
  { href: "/admin/audit", label: "Audit Logs" },
  { href: "/admin/settings", label: "System Settings" },
];

export function Sidebar() {
  return (
    <aside className="surface hidden h-[calc(100vh-8rem)] min-w-72 flex-col overflow-auto rounded-3xl p-4 lg:flex">
      <h2 className="mb-3 text-sm font-semibold text-muted">ناوبری Enterprise</h2>
      <ul className="space-y-2">
        {links.map((item) => (
          <li key={item.href}>
            <Link className="block rounded-xl px-3 py-2 text-sm transition hover:bg-[var(--color-primary)]/10" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
