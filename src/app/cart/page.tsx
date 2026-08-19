import Link from "next/link";
import { AppShell } from "@/layouts/AppShell";
import { CartClient } from "@/features/commerce/CartClient";

export default function CartPage() {
  return (
    <AppShell>
      <CartClient />
      <div className="flex justify-end">
        <Link href="/checkout" className="btn-primary">ادامه فرآیند پرداخت</Link>
      </div>
    </AppShell>
  );
}
