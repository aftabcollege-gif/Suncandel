import { AppShell } from "@/layouts/AppShell";
import { DataTable } from "@/components/data/DataWidgets";

export default function AdminCrmPage() {
  return (
    <AppShell>
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">CRM و تعاملات مشتری</h2>
        <p className="text-sm text-muted">مدیریت ارتباطات، تاریخچه گفتگو و پایش رضایت</p>
      </section>
      <DataTable
        columns={["مشتری", "کانال", "موضوع", "آخرین بروزرسانی"]}
        rows={[
          ["الهام رضایی", "whatsapp", "پیگیری سفارش", "۱۱:۲۰"],
          ["ندا شریفی", "phone", "درخواست تعویض", "۱۰:۱۰"],
          ["علی عباسی", "email", "پیشنهاد همکاری", "دیروز"],
        ]}
      />
    </AppShell>
  );
}
