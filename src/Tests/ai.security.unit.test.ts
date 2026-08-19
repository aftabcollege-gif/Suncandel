import assert from "node:assert/strict";
import test from "node:test";
import { normalizeFa } from "@/Domain/ai/nlp";

test("normalizer strips harmful script-like tokens to plain text", () => {
  const normalized = normalizeFa("<script>alert(1)</script> شمع");
  assert.ok(!normalized.includes("<script>"));
  assert.ok(normalized.includes("شمع"));
});
