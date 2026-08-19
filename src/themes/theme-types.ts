export type ThemeName =
  | "minimalism"
  | "glassmorphism"
  | "neomorphism"
  | "skeuomorphism"
  | "spatial"
  | "liquid-glass";

export type ThemeTokens = {
  name: ThemeName;
  labelFa: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    border: string;
    text: string;
    mutedText: string;
    success: string;
    warning: string;
    error: string;
  };
  radius: string;
  cardShadow: string;
  softShadow: string;
  glass?: string;
  blur?: string;
  layoutDensity: "compact" | "cozy" | "airy";
  motionStyle: "subtle" | "smooth" | "dynamic";
  interactionStyle: "flat" | "elevated" | "elastic";
};
