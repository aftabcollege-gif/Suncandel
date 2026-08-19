import "dotenv/config";
import assert from "node:assert/strict";
import test from "node:test";
import { sql } from "drizzle-orm";
import { db } from "@/db";

test("database connectivity check", async () => {
  const result = await db.execute(sql`select 1 as ok`);
  assert.ok(result);
});
