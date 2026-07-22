import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { sessionLabel } from "@/lib/progress";

export default async function TeamDashboard() {
  const [activeCount, nextSession, unreadMessages, unreadFeedback, worksheetCount] =
    await Promise.all([
      prisma.participant.count({ where: { active: true } }),
      prisma.programSession.findFirst({
        where: { date: { gte: new Date() } },
        orderBy: { date: "asc" },
      }),
      prisma.message.count({
        where: { sender: "TEILNEHMER", readByStaff: false },
      }),
      prisma.feedback.count({ where: { readByStaff: false } }),
      prisma.worksheetResponse.count(),
    ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Aktive Teilnehmende" value={activeCount} />
        <StatCard label="Ungelesene Nachrichten" value={unreadMessages} highlight={unreadMessages > 0} />
        <StatCard label="Neues Feedback" value={unreadFeedback} highlight={unreadFeedback > 0} />
        <StatCard label="Bearbeitete Arbeitsblätter" value={worksheetCount} />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-stone-900">Nächster Termin</h2>
        {nextSession ? (
          <div className="mt-2">
            <p className="text-stone-800">
              {sessionLabel(nextSession)} – {nextSession.title}
            </p>
            <p className="text-sm text-stone-500">
              {new Intl.DateTimeFormat("de-DE", {
                dateStyle: "full",
                timeStyle: "short",
              }).format(nextSession.date)}
              {nextSession.location ? ` · ${nextSession.location}` : ""}
            </p>
            <Link
              href={`/team/kalender/${nextSession.id}`}
              className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline"
            >
              Anwesenheit erfassen →
            </Link>
          </div>
        ) : (
          <p className="mt-2 text-sm text-stone-500">
            Kein bevorstehender Termin geplant.{" "}
            <Link href="/team/kalender" className="font-medium text-brand-700 hover:underline">
              Termin anlegen
            </Link>
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink href="/team/teilnehmende" label="Teilnehmende verwalten" emoji="🚗" />
        <QuickLink href="/team/nachrichten" label="Nachrichten beantworten" emoji="💬" />
        <QuickLink href="/team/kalender" label="Termine & Anwesenheit" emoji="📅" />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        highlight ? "border-brand-300 bg-brand-50" : "border-stone-200 bg-white"
      }`}
    >
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-1 text-3xl font-semibold text-stone-900">{value}</p>
    </div>
  );
}

function QuickLink({
  href,
  label,
  emoji,
}: {
  href: string;
  label: string;
  emoji: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-brand-300"
    >
      <span className="text-2xl">{emoji}</span>
      <span className="font-medium text-stone-800">{label}</span>
    </Link>
  );
}
