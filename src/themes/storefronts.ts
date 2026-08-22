import type { ThemeName } from "@/themes/theme-types";

export type StorefrontConfig = {
  code: string;
  hostPatterns: string[];
  nameFa: string;
  taglineFa: string;
  logoMark: string;
  defaultTheme: ThemeName;
  accentNote: string;
};

export const storefronts: StorefrontConfig[] = [
  {
    code: "sun-main",
    hostPatterns: ["sun.ir", "suncandel-beta.vercel.app", "localhost", "127.0.0.1"],
    nameFa: "سان‌کندل",
    taglineFa: "شبکه تولید و پخش شمع، لوازم جشن تولد، قنادی، بسته‌بندی و هدیه",
    logoMark: "SUN",
    defaultTheme: "minimalism",
    accentNote: "آتلیه شمع و شعله",
  },
  {
    code: "candle-lab",
    hostPatterns: ["store1.sun.ir", "candlelab.ir"],
    nameFa: "Candle Lab",
    taglineFa: "شمع‌های دست‌ساز هنری با رایحه اختصاصی",
    logoMark: "CL",
    defaultTheme: "glassmorphism",
    accentNote: "Artisan Candle Studio",
  },
  {
    code: "party-craft",
    hostPatterns: ["store2.sun.ir", "partycrafthouse.ir"],
    nameFa: "Party Craft House",
    taglineFa: "لوازم جشن، بسته‌بندی و هدایا",
    logoMark: "PC",
    defaultTheme: "spatial",
    accentNote: "Celebration Experience Store",
  },
];

export const fallbackStorefront = storefronts[0];
