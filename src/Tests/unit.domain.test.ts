import assert from "node:assert/strict";
import test from "node:test";
import { applyDiscount, computeOrderTotal } from "@/Domain/catalog/pricing";
import { assertValidOrderTransition } from "@/Domain/commerce/orderRules";

test("pricing applies discount correctly", () => {
  assert.equal(applyDiscount(100000, 15), 85000);
  assert.equal(applyDiscount(100000, 0), 100000);
});

test("order total computes from lines", () => {
  const total = computeOrderTotal([
    { unitPrice: 10000, quantity: 2 },
    { unitPrice: 15000, quantity: 3 },
  ]);

  assert.equal(total, 65000);
});

test("order transition allows valid path", () => {
  assert.doesNotThrow(() => assertValidOrderTransition("created", "confirmed"));
});

test("order transition blocks invalid path", () => {
  assert.throws(() => assertValidOrderTransition("created", "shipping"));
});
