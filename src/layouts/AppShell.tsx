import { Footer } from "@/components/navigation/Footer";
import { Header } from "@/components/navigation/Header";
import { Sidebar } from "@/components/navigation/Sidebar";
import { PageMotion } from "@/components/interaction/PageMotion";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <Header />
      <main className="container-main my-6 grid gap-6 lg:grid-cols-[18rem_1fr]">
        <Sidebar />
        <PageMotion>
          <div className="space-y-6">{children}</div>
        </PageMotion>
      </main>
      <Footer />
    </div>
  );
}
