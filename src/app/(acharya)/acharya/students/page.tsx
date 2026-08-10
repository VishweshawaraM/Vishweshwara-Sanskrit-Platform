import { asc, eq } from "drizzle-orm";
import Link from "next/link";

import { AddStudentForm } from "@/components/acharya/add-student-form";
import { db } from "@/db";
import { path, person } from "@/db/schema";

export default async function StudentsPage() {
  const students = await db()
    .select({
      id: person.id,
      name: person.nameLatin,
      email: person.email,
      country: person.country,
      timezone: person.timezone,
      status: person.status,
    })
    .from(person)
    .where(eq(person.role, "student"))
    .orderBy(asc(person.nameLatin));

  const paths = await db()
    .select({ id: path.id, name: path.nameLatin })
    .from(path)
    .where(eq(path.isPublished, true))
    .orderBy(asc(path.sortOrder));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Students</h1>
          <p className="text-muted mt-2">
            {students.length === 0
              ? "No students yet. Add your first below."
              : `${students.length} on the rolls.`}
          </p>
        </div>
        <AddStudentForm paths={paths} />
      </header>

      <ul className="space-y-2">
        {students.map((s) => (
          <li key={s.id}>
            <Link
              href={`/acharya/students/${s.id}`}
              className="border-border bg-surface hover:border-primary flex items-baseline justify-between gap-6 rounded-md border px-5 py-4 no-underline transition-colors duration-150"
            >
              <span className="text-heading">
                {s.name}
                <span className="text-muted ml-3 text-sm">{s.email}</span>
              </span>
              <span className="text-muted shrink-0 text-sm">
                {s.country ?? "—"} · {s.timezone} · {s.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
