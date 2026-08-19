import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";
import { Cormorant_Garamond, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Providers } from "@/app/providers";
import { resolveStorefrontByHost } from "@/utils/storefront";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "SUN | آتلیه شمع",
  description: "شمع دست‌ساز و لوازم جشن؛ خورشید کوچک روی میز شما",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const hdrs = await headers();
  const host = hdrs.get("host");
  const storefront = resolveStorefrontByHost(host);

  return (
    <html lang="fa" dir="rtl" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body data-store={storefront.code}>
        <Providers storefront={storefront} initialTheme={storefront.defaultTheme}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
