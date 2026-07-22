import Link from "next/link";
import { requireParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  WORKSHEETS,
  countAnswered,
  isWorksheetComplete,
  type WorksheetAnswers,
} from "@/lib/worksheets";

export default async function MitarbeitPage() {
  const participant = await requireParticipant();
  const responses = await prisma.worksheetResponse.findMany({
    where: { participantId: participant.id },
  });
  const byKey = new Map(responses.map((r) => [r.worksheetKey, r.answers]));

  const completed = WORKSHEETS.filter((w) =>
    isWorksheetComplete(w, byKey.get(w.key) as WorksheetAnswers | undefined),
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Mitarbeit</h1>
        <p className="text-sm text-stone-500">
          Hier bearbeitest du deine Arbeitsblätter. Nimm dir Zeit und antworte
          ehrlich – nur die Betreuenden können deine Antworten sehen. Du kannst
          alles jederzeit ändern.
        </p>
        <p className="mt-2 text-sm font-medium text-brand-800">
          {completed} von {WORKSHEETS.length} Arbeitsblättern abgeschlossen
        </p>
      </div>

      <ul className="space-y-3">
        {WORKSHEETS.map((w, index) => {
          const answers = byKey.get(w.key) as WorksheetAnswers | undefined;
          const answered = countAnswered(w, answers);
          const complete = answered === w.fields.length;
          const started = answered > 0;
          return (
            <li key={w.key}>
              <Link
                href={`/programm/mitarbeit/${w.key}`}
                className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-brand-400 hover:shadow-md"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-stone-400">
                      {index + 1}.
                    </span>
                    <span className="font-semibold text-stone-900">
                      {w.title}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-stone-500">
                    {w.intro}
                  </p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                    complete
                      ? "bg-brand-100 text-brand-800"
                      : started
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {complete
                    ? "Abgeschlossen"
                    : started
                      ? "In Bearbeitung"
                      : "Offen"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
