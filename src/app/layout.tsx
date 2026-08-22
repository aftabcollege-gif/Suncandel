import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "@/app/providers";
import { resolveStorefrontByHost } from "@/utils/storefront";

export const metadata: Metadata = {
  metadataBase: new URL("https://suncandel-beta.vercel.app"),
  title: "سان کندل | شمع و ملزومات جشن",
  description:
    "سان‌کندل شبکه تولید و پخش شمع، لوازم جشن تولد، قنادی، بسته‌بندی و هدیه است؛ روشن از شعله، نه از برچسب و جایگاه.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const storefront = resolveStorefrontByHost(host);

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body data-store={storefront.code}>
        <Providers storefront={storefront} initialTheme={storefront.defaultTheme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
