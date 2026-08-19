const stopWords = new Set([
  "برای",
  "و",
  "یا",
  "از",
  "به",
  "که",
  "در",
  "با",
  "یه",
  "یک",
  "را",
  "می",
  "من",
  "تو",
  "شما",
  "چه",
  "چی",
]);

export function normalizeFa(text: string) {
  return text
    .toLowerCase()
    .replaceAll("ي", "ی")
    .replaceAll("ك", "ک")
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenizeFa(text: string) {
  return normalizeFa(text)
    .split(" ")
    .filter((token) => token.length > 1 && !stopWords.has(token));
}

export function jaccardSimilarity(a: string, b: string) {
  const aTokens = new Set(tokenizeFa(a));
  const bTokens = new Set(tokenizeFa(b));
  if (aTokens.size === 0 && bTokens.size === 0) return 0;

  let intersection = 0;
  aTokens.forEach((token) => {
    if (bTokens.has(token)) intersection += 1;
  });

  const union = new Set([...aTokens, ...bTokens]).size;
  return union === 0 ? 0 : intersection / union;
}

export function classifyIntent(query: string) {
  const q = normalizeFa(query);

  if (/(قیمت|چنده|هزینه)/.test(q)) return "price_question";
  if (/(موجود|دارید|انبار)/.test(q)) return "inventory_question";
  if (/(خرید|میخوام|سفارش)/.test(q)) return "purchase_intent";
  if (/(مقایسه|تفاوت)/.test(q)) return "comparison";
  if (/(هدیه|تولد|سالگرد|مناسبت)/.test(q)) return "gift_advice";
  return "general_discovery";
}

export function extractQuantity(text: string) {
  const normalized = normalizeFa(text);
  const match = normalized.match(/(\d+)\s*(عدد|تا|دونه)?/);
  if (!match) return 1;
  return Math.max(1, Number(match[1]));
}
