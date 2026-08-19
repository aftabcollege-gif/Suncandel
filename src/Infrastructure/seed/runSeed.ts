import { config } from "dotenv";

config({ path: ".env.prod" });
config({ path: ".env.local" });
config({ path: ".env" });

import { runSeed } from "@/Infrastructure/seed/seed";

runSeed()
  .then((result) => {
    console.log("Seed completed:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
