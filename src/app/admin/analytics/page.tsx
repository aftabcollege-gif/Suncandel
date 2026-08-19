import { AppShell } from "@/layouts/AppShell";
import { AnalyticsWidget } from "@/components/data/DataWidgets";

export default function AdminAnalyticsPage() {
  return (
    <AppShell>
      <div className="grid gap-4 lg:grid-cols-2">
        <AnalyticsWidget title="GMV هفتگی" data={[11, 20, 17, 30, 28, 39, 44]} />
        <AnalyticsWidget title="Vendor Onboarding" data={[2, 5, 3, 6, 7, 4, 8]} />
      </div>
    </AppShell>
  );
}
