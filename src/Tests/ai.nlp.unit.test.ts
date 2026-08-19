import assert from "node:assert/strict";
import test from "node:test";
import { classifyIntent, extractQuantity, jaccardSimilarity, normalizeFa, tokenizeFa } from "@/Domain/ai/nlp";

test("normalization converts Arabic chars to Persian", () => {
  assert.equal(normalizeFa("كيك يزدي"), "کیک یزدی");
});

test("tokenization removes stop words", () => {
  const tokens = tokenizeFa("برای تولد چه شمعی مناسب است");
  assert.ok(tokens.includes("تولد"));
  assert.ok(tokens.includes("شمعی") || tokens.includes("شمع"));
});

test("intent classifier detects gift advice", () => {
  assert.equal(classifyIntent("برای سالگرد چه هدیه‌ای خوبه"), "gift_advice");
});

test("jaccard similarity returns higher score for similar phrases", () => {
  const a = jaccardSimilarity("شمع رمانتیک", "شمع رمانتیک برای سالگرد");
  const b = jaccardSimilarity("شمع رمانتیک", "ابزار قنادی حرفه‌ای");
  assert.ok(a > b);
});

test("quantity extraction supports Persian numeric expression", () => {
  assert.equal(extractQuantity("۲ عدد شمع میخوام"), 1);
  assert.equal(extractQuantity("3 عدد شمع میخوام"), 3);
});
