import { DataTable } from "@/components/data/DataWidgets";

export function PortalSection({
  title,
  subtitle,
  columns,
  rows,
}: {
  title: string;
  subtitle: string;
  columns: string[];
  rows: Array<Array<string | number>>;
}) {
  return (
    <div className="space-y-4">
      <section className="surface rounded-3xl p-5">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      </section>
      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
