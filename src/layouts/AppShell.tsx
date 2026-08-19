"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/navigation/Footer";
import { Header } from "@/components/navigation/Header";
import { Sidebar } from "@/components/navigation/Sidebar";
import { PageMotion } from "@/components/interaction/PageMotion";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isPortal = path.startsWith("/admin") || path.startsWith("/vendor");

  return (
    <div className="site-root">
      <Header />
      {isPortal ? (
        <main className="portal-main">
          <Sidebar />
          <PageMotion>
            <div className="space-y-6">{children}</div>
          </PageMotion>
        </main>
      ) : (
        <main className="store-main">
          <PageMotion>{children}</PageMotion>
        </main>
      )}
      <Footer />
    </div>
  );
}
