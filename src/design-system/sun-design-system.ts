export const sunBrandDNA = {
  identity: ["Luxury", "Handmade", "Premium", "Trust", "Modern"],
  voice: ["confident", "warm", "crafted", "professional"],
  visualPillars: ["depth", "materiality", "clarity", "conversion-first hierarchy"],
};

export const sunTypographySystem = {
  persian: {
    primary: "Vazirmatn",
    fallback: ["IRANSansX", "Tahoma", "Arial"],
  },
  latin: {
    primary: "Inter",
    fallback: ["Segoe UI", "Arial"],
  },
  scale: {
    h1: "3rem",
    h2: "2.25rem",
    h3: "1.75rem",
    body: "1rem",
    caption: "0.85rem",
  },
};

export const sunComponentRules = {
  cards: {
    principle: "story + trust + action",
    antiPattern: "flat generic cards without hierarchy",
  },
  buttons: {
    principle: "clear priority and tactile feedback",
    antiPattern: "identical CTA and secondary visual weight",
  },
  forms: {
    principle: "low-friction and high-contrast focus",
    antiPattern: "placeholder-only labels",
  },
  navigation: {
    principle: "role-based entry + brand context",
    antiPattern: "single generic navbar for all personas",
  },
  dashboards: {
    principle: "decision-ready layout with operational signals",
    antiPattern: "widget-only generic grids",
  },
};
