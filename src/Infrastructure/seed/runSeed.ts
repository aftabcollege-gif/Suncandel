import { readFileSync } from "node:fs";

function loadEnvFile(path: string) {
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const eq = trimmed.indexOf("=");
      const key = trimmed.slice(0, eq);
      let value = trimmed.slice(eq + 1);
      if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional file
  }
}

loadEnvFile(".env.prod");
loadEnvFile(".env.local");
loadEnvFile(".env");

async function main() {
  const url = process.env.DATABASE_URL ?? "";
  console.log("DATABASE_URL length:", url.length, "host:", url.includes("@") ? url.split("@")[1]?.split("/")[0] : "none");
  const { ensureAuthTables } = await import("./ensureAuthTables");
  const { runSeed } = await import("./seed");
  await ensureAuthTables();
  const result = await runSeed();
  console.log("Seed completed:", result);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
