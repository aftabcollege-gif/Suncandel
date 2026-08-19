import { AppShell } from "@/layouts/AppShell";
import { HomeLanding } from "@/features/home/HomeLanding";
import { ComponentShowcase } from "@/features/ui/ComponentShowcase";

export default function HomePage() {
  return (
    <AppShell>
      <HomeLanding />
      <ComponentShowcase />
    </AppShell>
  );
}
