/** Seeds only the curriculum — no people. Used to generate supabase-setup.sql. */
import { seedCurriculum } from "../src/db/seed";

async function main() {
  await seedCurriculum();
  console.log("Curriculum seeded.");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
