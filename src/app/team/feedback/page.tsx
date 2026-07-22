import { prisma } from "@/lib/prisma";
import { markFeedbackReadByStaff } from "@/lib/actions/feedback-actions";

export default async function TeamFeedbackPage() {
  const feedback = await prisma.feedback.findMany({
    include: { participant: true },
    orderBy: { createdAt: "desc" },
  });

  // Beim Öffnen alles als gelesen markieren.
  await markFeedbackReadByStaff();

  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 px-6 py-4">
        <h1 className="font-semibold text-stone-900">Feedback</h1>
        <p className="text-sm text-stone-500">
          Rückmeldungen der Teilnehmenden zum Programm – anonym über ihre
          Automarke.
        </p>
      </div>
      <ul className="divide-y divide-stone-100">
        {feedback.map((f) => (
          <li key={f.id} className="px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">{f.participant.fruitEmoji}</span>
              <span className="font-medium text-stone-900">
                {f.participant.fruitName}
              </span>
              {!f.readByStaff && (
                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-medium text-white">
                  neu
                </span>
              )}
              <span className="ml-auto text-xs text-stone-400">
                {new Intl.DateTimeFormat("de-DE", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(f.createdAt)}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-stone-800">
              {f.body}
            </p>
          </li>
        ))}
        {feedback.length === 0 && (
          <li className="px-6 py-8 text-center text-sm text-stone-500">
            Noch kein Feedback vorhanden.
          </li>
        )}
      </ul>
    </div>
  );
}
