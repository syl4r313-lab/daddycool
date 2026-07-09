import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeProgress, sessionLabel } from "@/lib/progress";
import { EditParticipantForm } from "@/components/EditParticipantForm";
import { ResetCodeButton } from "@/components/ResetCodeButton";
import { ProgressBar } from "@/components/ProgressBar";
import { ToggleActiveButton } from "@/components/ToggleActiveButton";

const ATTENDANCE_LABELS: Record<string, string> = {
  OFFEN: "Offen",
  ANWESEND: "Anwesend",
  ENTSCHULDIGT: "Entschuldigt",
  UNENTSCHULDIGT: "Unentschuldigt",
};

export default async function TeilnehmerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const participant = await prisma.participant.findUnique({
    where: { id },
    include: {
      attendances: { include: { session: true }, orderBy: { session: { date: "asc" } } },
    },
  });
  if (!participant) notFound();

  const progress = computeProgress(participant.attendances);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{participant.fruitEmoji}</span>
          <div>
            <h1 className="text-xl font-semibold text-stone-900">
              {participant.fruitName}
            </h1>
            <p className="text-sm text-stone-500">
              Angelegt am{" "}
              {new Intl.DateTimeFormat("de-DE", { dateStyle: "medium" }).format(
                participant.createdAt,
              )}
            </p>
          </div>
        </div>
        <ToggleActiveButton
          participantId={participant.id}
          active={participant.active}
        />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-stone-900">Fortschritt im Programm</h2>
        <div className="mt-3">
          <ProgressBar percent={progress.prozent} />
        </div>
        <p className="mt-2 text-sm text-stone-600">
          {progress.gesamtAbsolviert} von {progress.gesamtTermine} Terminen
          absolviert
          {progress.zertifikatErreicht ? " – Zertifikat erreicht 🎉" : ""}
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <MiniStat
            label="Erstgespräch"
            value={progress.interviewAbsolviert ? "Erledigt" : "Ausstehend"}
            done={progress.interviewAbsolviert}
          />
          <MiniStat
            label="Sitzungen"
            value={`${progress.sitzungenAbsolviert} / ${progress.sitzungenGesamt}`}
            done={progress.sitzungenAbsolviert === progress.sitzungenGesamt}
          />
          <MiniStat
            label="Abschlussgespräch"
            value={progress.abschlussAbsolviert ? "Erledigt" : "Ausstehend"}
            done={progress.abschlussAbsolviert}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-stone-900">Interne Angaben</h2>
          <p className="mt-1 text-xs text-stone-500">
            Nur für Betreuende sichtbar – erscheint nie im Teilnehmenden-Bereich.
          </p>
          <div className="mt-4">
            <EditParticipantForm
              participantId={participant.id}
              realName={participant.realName}
              notes={participant.notes}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-stone-900">Zugangscode</h2>
          <p className="mt-1 text-sm text-stone-500">
            Bei Verlust kann ein neuer Code erstellt werden. Der alte Code
            wird dadurch ungültig.
          </p>
          <div className="mt-4">
            <ResetCodeButton participantId={participant.id} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4">
          <h2 className="font-semibold text-stone-900">Terminverlauf</h2>
        </div>
        <ul className="divide-y divide-stone-100">
          {participant.attendances.map((a) => (
            <li key={a.id} className="flex items-center justify-between px-6 py-3">
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {sessionLabel(a.session)}
                </p>
                <p className="text-xs text-stone-500">
                  {new Intl.DateTimeFormat("de-DE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(a.session.date)}
                </p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  a.status === "ANWESEND"
                    ? "bg-teal-100 text-teal-800"
                    : a.status === "UNENTSCHULDIGT"
                      ? "bg-red-100 text-red-700"
                      : a.status === "ENTSCHULDIGT"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-stone-100 text-stone-600"
                }`}
              >
                {ATTENDANCE_LABELS[a.status]}
              </span>
            </li>
          ))}
          {participant.attendances.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-stone-500">
              Noch keine Termine erfasst.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  done,
}: {
  label: string;
  value: string;
  done: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-center ${
        done ? "border-teal-300 bg-teal-50" : "border-stone-200 bg-stone-50"
      }`}
    >
      <p className="text-xs text-stone-500">{label}</p>
      <p
        className={`mt-1 text-sm font-semibold ${
          done ? "text-teal-800" : "text-stone-700"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
