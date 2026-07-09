import Link from "next/link";
import { requireParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { computeProgress, sessionLabel } from "@/lib/progress";
import { ProgressBar } from "@/components/ProgressBar";

export default async function ProgrammDashboard() {
  const participant = await requireParticipant();
  const attendances = await prisma.attendance.findMany({
    where: { participantId: participant.id },
    include: { session: true },
    orderBy: { session: { date: "asc" } },
  });

  const progress = computeProgress(attendances);
  const now = new Date();
  const nextAttendance = attendances.find((a) => a.session.date >= now);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">
          Willkommen, {participant.fruitName} {participant.fruitEmoji}
        </h1>
        <p className="text-sm text-stone-500">
          Hier siehst du deinen Fortschritt im Programm und deinen nächsten
          Termin.
        </p>
      </div>

      {nextAttendance ? (
        <ReminderBanner
          title={sessionLabel(nextAttendance.session)}
          date={nextAttendance.session.date}
          location={nextAttendance.session.location}
          days={Math.ceil(
            (nextAttendance.session.date.getTime() - now.getTime()) /
              (1000 * 60 * 60 * 24),
          )}
        />
      ) : (
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-stone-500">
            Aktuell ist kein weiterer Termin geplant. Schau später wieder
            vorbei oder frag im{" "}
            <Link href="/programm/kontakt" className="text-teal-700 hover:underline">
              Kontaktbereich
            </Link>{" "}
            nach.
          </p>
        </div>
      )}

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-stone-900">Dein Fortschritt</h2>
        <div className="mt-3">
          <ProgressBar percent={progress.prozent} />
        </div>
        <p className="mt-2 text-sm text-stone-600">
          {progress.gesamtAbsolviert} von {progress.gesamtTermine} Terminen
          absolviert ({progress.prozent}%)
        </p>
        {progress.zertifikatErreicht && (
          <p className="mt-2 rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800">
            🎉 Du hast alle Termine absolviert und dein Zertifikat erreicht!
          </p>
        )}
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
    </div>
  );
}

function ReminderBanner({
  title,
  date,
  location,
  days,
}: {
  title: string;
  date: Date;
  location: string | null;
  days: number;
}) {
  const dayLabel =
    days <= 0 ? "heute" : days === 1 ? "morgen" : `in ${days} Tagen`;

  return (
    <div className="rounded-2xl border border-teal-300 bg-teal-50 p-6 shadow-sm">
      <p className="text-sm font-medium text-teal-800">Nächster Termin – {dayLabel}</p>
      <p className="mt-1 text-lg font-semibold text-teal-900">{title}</p>
      <p className="text-sm text-teal-800">
        {new Intl.DateTimeFormat("de-DE", {
          dateStyle: "full",
          timeStyle: "short",
        }).format(date)}
        {location ? ` · ${location}` : ""}
      </p>
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
