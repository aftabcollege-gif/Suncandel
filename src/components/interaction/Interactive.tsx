"use client";

import { useState } from "react";

export function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-secondary" onClick={() => setOpen(true)}>نمایش Modal</button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
          <div className="surface w-full max-w-lg rounded-3xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">{title}</h3>
              <button className="btn-ghost" onClick={() => setOpen(false)}>بستن</button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}

export function Drawer({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn-secondary" onClick={() => setOpen(true)}>نمایش Drawer</button>
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-md bg-[var(--color-surface)] p-5 transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">{title}</h3>
          <button className="btn-ghost" onClick={() => setOpen(false)}>بستن</button>
        </div>
        {children}
      </aside>
    </>
  );
}

export function Tooltip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span className="pointer-events-none absolute bottom-full right-1/2 mb-2 translate-x-1/2 rounded-lg bg-[var(--color-text)] px-2 py-1 text-xs text-[var(--color-background)] opacity-0 transition group-hover:opacity-100">
        {text}
      </span>
    </span>
  );
}

export function ToastPreview() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button className="btn-secondary" onClick={() => setShow(true)}>نمایش Toast</button>
      {show ? (
        <div className="fixed bottom-5 right-5 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm text-[var(--color-background)] shadow-xl">
          عملیات با موفقیت انجام شد
          <button className="mr-3 underline" onClick={() => setShow(false)}>بستن</button>
        </div>
      ) : null}
    </div>
  );
}

export function Accordion({ items }: { items: Array<{ title: string; content: string }> }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <details key={item.title} className="surface rounded-2xl p-3">
          <summary className="cursor-pointer font-semibold">{item.title}</summary>
          <p className="mt-2 text-sm text-muted">{item.content}</p>
        </details>
      ))}
    </div>
  );
}

export function Tabs({ tabs }: { tabs: Array<{ label: string; content: React.ReactNode }> }) {
  const [active, setActive] = useState(0);
  return (
    <div className="surface rounded-3xl p-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={i === active ? "btn-primary" : "btn-ghost"}
            onClick={() => setActive(i)}
            aria-current={i === active}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>{tabs[active]?.content}</div>
    </div>
  );
}

export function NotificationBell({ count }: { count: number }) {
  return (
    <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--color-border)]" aria-label="اعلان‌ها">
      🔔
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 rounded-full bg-[var(--color-error)] px-1.5 text-[10px] text-white">{count}</span>
      ) : null}
    </button>
  );
}
