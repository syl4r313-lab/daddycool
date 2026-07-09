import { requireParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sessionLabel } from "@/lib/progress";
import type { SessionType } from "@/generated/prisma/client";

const STATUS_LABELS: Record<string, string> = {
  OFFEN: "Noch offen",
  ANWESEND: "Anwesend",
  ENTSCHULDIGT: "Entschuldigt",
  UNENTSCHULDIGT: "Unentschuldigt",
};

export default async function ProgrammKalenderPage() {
  const participant = await requireParticipant();
  const attendances = await prisma.attendance.findMany({
    where: { participantId: participant.id },
    include: { session: true },
    orderBy: { session: { date: "asc" } },
  });

  const now = new Date();
  const upcoming = attendances.filter((a) => a.session.date >= now);
  const past = attendances.filter((a) => a.session.date < now).reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Kalender</h1>
        <p className="text-sm text-stone-500">
          Alle Termine des Programms: 1 Erstgespräch, 8 Sitzungen und ein
          Abschlussgespräch.
        </p>
      </div>

      <List title="Kommende Termine" items={upcoming} emptyText="Aktuell kein weiterer Termin geplant." />
      <List title="Vergangene Termine" items={past} emptyText="Noch keine vergangenen Termine." />
    </div>
  );
}

function List({
  title,
  items,
  emptyText,
}: {
  title: string;
  items: Array<{
    id: string;
    status: string;
    session: {
      type: SessionType;
      sitzungNummer: number | null;
      title: string;
      date: Date;
      location: string | null;
    };
  }>;
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 px-6 py-4">
        <h2 className="font-semibold text-stone-900">{title}</h2>
      </div>
      <ul className="divide-y divide-stone-100">
        {items.map((a) => (
          <li key={a.id} className="flex items-center justify-between gap-4 px-6 py-4">
            <div>
              <p className="font-medium text-stone-900">
                {sessionLabel(a.session)} · {a.session.title}
              </p>
              <p className="text-sm text-stone-500">
                {new Intl.DateTimeFormat("de-DE", {
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(a.session.date)}
                {a.session.location ? ` · ${a.session.location}` : ""}
              </p>
            </div>
            <span
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                a.status === "ANWESEND"
                  ? "bg-brand-100 text-brand-800"
                  : a.status === "UNENTSCHULDIGT"
                    ? "bg-red-100 text-red-700"
                    : a.status === "ENTSCHULDIGT"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-stone-100 text-stone-600"
              }`}
            >
              {STATUS_LABELS[a.status]}
            </span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="px-6 py-8 text-center text-sm text-stone-500">
            {emptyText}
          </li>
        )}
      </ul>
    </div>
  );
}
