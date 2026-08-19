export function DashboardCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <article className="surface rounded-3xl p-4">
      <p className="text-xs text-muted">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </article>
  );
}

export function DataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <div className="surface overflow-x-auto rounded-3xl p-4">
      <table className="w-full text-right text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {columns.map((col) => (
              <th key={col} className="px-2 py-3 font-semibold">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-[var(--color-border)]/60">
              {row.map((cell, ci) => (
                <td key={ci} className="px-2 py-3">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Timeline({ events }: { events: Array<{ time: string; label: string }> }) {
  return (
    <ol className="surface space-y-3 rounded-3xl p-4">
      {events.map((event) => (
        <li key={event.time + event.label} className="flex gap-3">
          <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-primary)]" />
          <div>
            <p className="text-xs text-muted">{event.time}</p>
            <p className="text-sm">{event.label}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function AnalyticsWidget({ title, data }: { title: string; data: number[] }) {
  const max = Math.max(...data, 1);
  return (
    <section className="surface rounded-3xl p-4">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="flex h-28 items-end gap-2">
        {data.map((v, i) => (
          <div
            key={i}
            className="w-full rounded-t-lg bg-gradient-to-t from-[var(--color-secondary)] to-[var(--color-accent)]"
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
    </section>
  );
}
