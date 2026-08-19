"use client";

import { Input, Select, Checkbox, RadioGroup } from "@/components/forms/Fields";
import { Accordion, Drawer, Modal, NotificationBell, Tabs, ToastPreview, Tooltip } from "@/components/interaction/Interactive";

export function ComponentShowcase() {
  return (
    <section className="surface rounded-3xl p-5">
      <h2 className="mb-4 text-lg font-bold">Design System Components</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <Input placeholder="نام محصول" />
          <Select>
            <option>دسته‌بندی</option>
            <option>شمع</option>
            <option>لوازم جشن</option>
          </Select>
          <Checkbox label="موجود در انبار" defaultChecked />
          <RadioGroup
            name="shipment"
            options={[
              { label: "ارسال اقتصادی", value: "economy" },
              { label: "ارسال سریع", value: "express" },
            ]}
            value="economy"
          />
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Modal title="نمایش جزئیات سفارش">
              <p className="text-sm text-muted">این یک Modal سازگار با تم جاری است.</p>
            </Modal>
            <Drawer title="تنظیمات سریع">
              <p className="text-sm text-muted">این Drawer برای فیلترها و عملیات سریع قابل استفاده است.</p>
            </Drawer>
            <ToastPreview />
            <Tooltip text="اعلان‌ها">
              <span>
                <NotificationBell count={3} />
              </span>
            </Tooltip>
          </div>
          <Accordion
            items={[
              { title: "چطور سفارش ثبت کنم؟", content: "محصول را به سبد افزوده و فرآیند Checkout را تکمیل کنید." },
              { title: "چطور فروشنده شوم؟", content: "از پنل فروشنده، ثبت‌نام و تکمیل اطلاعات کسب‌وکار را انجام دهید." },
            ]}
          />
        </div>
      </div>
      <div className="mt-6">
        <Tabs
          tabs={[
            { label: "قوانین فروش", content: <p className="text-sm text-muted">کالا باید دارای توضیح و قیمت شفاف باشد.</p> },
            { label: "شرایط ارسال", content: <p className="text-sm text-muted">ارسال درون‌شهری و برون‌شهری بر اساس فروشگاه انجام می‌شود.</p> },
          ]}
        />
      </div>
    </section>
  );
}
