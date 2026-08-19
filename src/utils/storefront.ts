import { fallbackStorefront, storefronts, type StorefrontConfig } from "@/themes/storefronts";

export function resolveStorefrontByHost(hostHeader: string | null): StorefrontConfig {
  if (!hostHeader) return fallbackStorefront;
  const host = hostHeader.split(":")[0].toLowerCase();

  const matched = storefronts.find((store) =>
    store.hostPatterns.some((pattern) => {
      const p = pattern.toLowerCase();
      return host === p || host.endsWith(`.${p}`);
    })
  );

  return matched ?? fallbackStorefront;
}
