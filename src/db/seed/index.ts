import { db } from "@/db";
import { path, stage, syllabusItem } from "@/db/schema";
import { assertValidDevanagari } from "@/lib/sanskrit";
import { curriculum } from "./curriculum";

/** Idempotent: safe to re-run as the Acharya adds content. */
export async function seedCurriculum() {
  const database = db();

  for (const [pathIndex, p] of curriculum.entries()) {
    if (p.devanagari) assertValidDevanagari(p.devanagari, `path.${p.slug}`);

    const [inserted] = await database
      .insert(path)
      .values({
        slug: p.slug,
        nameLatin: p.latin,
        nameDevanagari: p.devanagari ?? null,
        summary: p.summary,
        durationMinMonths: p.minMonths ?? null,
        durationMaxMonths: p.maxMonths ?? null,
        sortOrder: pathIndex,
        isPublished: p.published,
      })
      .onConflictDoUpdate({
        target: path.slug,
        set: { nameLatin: p.latin, summary: p.summary, isPublished: p.published },
      })
      .returning();

    if (!inserted) continue;

    for (const s of p.stages) {
      assertValidDevanagari(s.devanagari, `${p.slug} stage ${s.number}`);

      const [insertedStage] = await database
        .insert(stage)
        .values({
          pathId: inserted.id,
          stageNumber: s.number,
          nameLatin: s.latin,
          nameDevanagari: s.devanagari,
          description: s.english,
          durationMinMonths: s.minMonths ?? null,
          durationMaxMonths: s.maxMonths ?? null,
        })
        .onConflictDoUpdate({
          target: [stage.pathId, stage.stageNumber],
          set: { nameLatin: s.latin, nameDevanagari: s.devanagari, description: s.english },
        })
        .returning();

      if (!insertedStage) continue;

      for (const [i, item] of (s.items ?? []).entries()) {
        if (item.devanagari) {
          assertValidDevanagari(item.devanagari, `${p.slug} ${s.latin} · ${item.latin}`);
        }
        await database.insert(syllabusItem).values({
          stageId: insertedStage.id,
          sortOrder: i,
          titleLatin: item.latin,
          titleDevanagari: item.devanagari ?? null,
          kind: item.kind ?? "topic",
        });
      }
    }
  }
}
