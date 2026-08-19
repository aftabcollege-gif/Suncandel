import "dotenv/config";
import assert from "node:assert/strict";
import test from "node:test";
import { requirePermission } from "@/Shared/auth";
import { hashPassword, verifyPassword } from "@/Shared/security";

test("password hashing and verification works", async () => {
  const hash = await hashPassword("StrongPass123");
  const ok = await verifyPassword("StrongPass123", hash);
  const bad = await verifyPassword("WrongPass", hash);

  assert.equal(ok, true);
  assert.equal(bad, false);
});

test("permission check allows wildcard", () => {
  assert.doesNotThrow(() => requirePermission(["*"], "audit:read"));
});

test("permission check rejects missing permission", () => {
  assert.throws(() => requirePermission(["order:read"], "payment:manage"));
});
