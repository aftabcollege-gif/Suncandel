import assert from "node:assert/strict";
import test from "node:test";
import { classifyIntent } from "@/Domain/ai/nlp";

test("instagram message with buy keyword maps to purchase intent", () => {
  assert.equal(classifyIntent("میخوام این شمع رو سفارش بدم"), "purchase_intent");
});

test("price related message maps to price question", () => {
  assert.equal(classifyIntent("قیمت این محصول چنده؟"), "price_question");
});
