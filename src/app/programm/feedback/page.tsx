import { requireParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FeedbackForm } from "@/components/FeedbackForm";

const TIPS = [
  "Beziehe dich auf konkrete Situationen statt auf pauschale Urteile.",
  "Sprich in Ich-Botschaften – z. B. „Ich habe mich … gefühlt“.",
  "Sag, was dir gutgetan hat – und was du dir anders wünschst.",
  "Bleib respektvoll, auch wenn du Kritik äußerst.",
  "Mach nach Möglichkeit einen konkreten Verbesserungsvorschlag.",
];

export default async function FeedbackPage() {
  const participant = await requireParticipant();
  const feedback = await prisma.feedback.findMany({
    where: { participantId: participant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Feedback</h1>
        <p className="text-sm text-stone-500">
          Hier kannst du den Betreuenden jederzeit Rückmeldung geben – egal, an
          welchem Punkt des Programms du gerade stehst. Dein Feedback hilft,
          das Programm zu verbessern.
        </p>
      </div>

      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
        <h2 className="text-sm font-semibold text-brand-900">
          So gelingt konstruktives Feedback
        </h2>
        <ul className="mt-2 space-y-1.5">
          {TIPS.map((tip) => (
            <li key={tip} className="flex gap-2 text-sm text-brand-900">
              <span aria-hidden="true" className="text-brand-500">
                •
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-stone-900">Neues Feedback</h2>
        <p className="mt-1 text-sm text-stone-500">
          Nur die Betreuenden können dein Feedback lesen – sichtbar ist dabei
          deine Automarke, nie dein Name.
        </p>
        <div className="mt-4">
          <FeedbackForm />
        </div>
      </div>

      {feedback.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-6 py-4">
            <h2 className="font-semibold text-stone-900">
              Dein bisheriges Feedback
            </h2>
          </div>
          <ul className="divide-y divide-stone-100">
            {feedback.map((f) => (
              <li key={f.id} className="px-6 py-4">
                <p className="whitespace-pre-wrap text-sm text-stone-800">
                  {f.body}
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  {new Intl.DateTimeFormat("de-DE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(f.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
