import {
  WORKSHEETS,
  countAnswered,
  type WorksheetAnswers,
} from "@/lib/worksheets";

/**
 * Schreibgeschützte Ansicht der ausgefüllten Arbeitsblätter – nur im
 * Team-Bereich. Zeigt pro Arbeitsblatt die Antworten der teilnehmenden Person.
 */
export function WorksheetResults({
  responses,
}: {
  responses: { worksheetKey: string; answers: unknown; updatedAt: Date }[];
}) {
  const byKey = new Map(
    responses.map((r) => [
      r.worksheetKey,
      { answers: r.answers as WorksheetAnswers, updatedAt: r.updatedAt },
    ]),
  );

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 px-6 py-4">
        <h2 className="font-semibold text-stone-900">Mitarbeit – Arbeitsblätter</h2>
        <p className="mt-0.5 text-sm text-stone-500">
          Die von der teilnehmenden Person ausgefüllten Antworten. Nur für das
          Team sichtbar.
        </p>
      </div>
      <div className="divide-y divide-stone-100">
        {WORKSHEETS.map((w) => {
          const entry = byKey.get(w.key);
          const answers = entry?.answers;
          const answered = countAnswered(w, answers);
          return (
            <details key={w.key} className="group px-6 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <span className="font-medium text-stone-900">{w.title}</span>
                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                    answered === w.fields.length
                      ? "bg-brand-100 text-brand-800"
                      : answered > 0
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {answered} / {w.fields.length}
                </span>
              </summary>

              {answered === 0 ? (
                <p className="mt-3 text-sm text-stone-500">
                  Noch nicht ausgefüllt.
                </p>
              ) : (
                <dl className="mt-3 space-y-3">
                  {w.fields.map((field) => {
                    const value = answers?.[field.key];
                    const hasValue =
                      value !== undefined &&
                      value !== null &&
                      !(typeof value === "string" && value.trim() === "");
                    return (
                      <div key={field.key}>
                        <dt className="text-sm font-medium text-stone-700">
                          {field.label}
                        </dt>
                        <dd className="mt-0.5 text-sm text-stone-600">
                          {!hasValue ? (
                            <span className="text-stone-400">—</span>
                          ) : field.type === "scale" ? (
                            <span className="font-semibold text-brand-800">
                              {value}
                              <span className="font-normal text-stone-500">
                                {" "}
                                / {field.max ?? 10}
                                {field.minLabel && field.maxLabel
                                  ? ` (${field.minLabel} … ${field.maxLabel})`
                                  : ""}
                              </span>
                            </span>
                          ) : (
                            <span className="whitespace-pre-wrap">
                              {String(value)}
                            </span>
                          )}
                        </dd>
                      </div>
                    );
                  })}
                  {entry?.updatedAt && (
                    <p className="pt-1 text-xs text-stone-400">
                      Zuletzt bearbeitet:{" "}
                      {new Intl.DateTimeFormat("de-DE", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(entry.updatedAt)}
                    </p>
                  )}
                </dl>
              )}
            </details>
          );
        })}
      </div>
    </div>
  );
}
