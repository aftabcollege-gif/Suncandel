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
