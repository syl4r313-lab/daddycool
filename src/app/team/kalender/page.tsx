import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { sessionLabel } from "@/lib/progress";
import { CreateSessionForm } from "@/components/CreateSessionForm";
import type { SessionType } from "@/generated/prisma/client";

export default async function TeamKalenderPage() {
  const [sessions, sitzungCount] = await Promise.all([
    prisma.programSession.findMany({
      orderBy: { date: "asc" },
      include: { attendances: true },
    }),
    prisma.programSession.count({ where: { type: "SITZUNG" } }),
  ]);

  const now = new Date();
  const upcoming = sessions.filter((s) => s.date >= now);
  const past = sessions.filter((s) => s.date < now).reverse();

  return (
    <div className="space-y-6">
      <CreateSessionForm nextSitzungNummer={Math.min(sitzungCount + 1, 8)} />

      <SessionList title="Kommende Termine" sessions={upcoming} emptyText="Keine kommenden Termine." />
      <SessionList title="Vergangene Termine" sessions={past} emptyText="Noch keine vergangenen Termine." />
    </div>
  );
}

function SessionList({
  title,
  sessions,
  emptyText,
}: {
  title: string;
  sessions: Array<{
    id: string;
    type: SessionType;
    sitzungNummer: number | null;
    title: string;
    date: Date;
    location: string | null;
    attendances: { status: string }[];
  }>;
  emptyText: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="border-b border-stone-200 px-6 py-4">
        <h2 className="font-semibold text-stone-900">{title}</h2>
      </div>
      <ul className="divide-y divide-stone-100">
        {sessions.map((session) => {
          const anwesend = session.attendances.filter(
            (a) => a.status === "ANWESEND",
          ).length;
          return (
            <li key={session.id}>
              <Link
                href={`/team/kalender/${session.id}`}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-stone-50"
              >
                <div>
                  <p className="font-medium text-stone-900">
                    {sessionLabel(session)} · {session.title}
                  </p>
                  <p className="text-sm text-stone-500">
                    {new Intl.DateTimeFormat("de-DE", {
                      dateStyle: "full",
                      timeStyle: "short",
                    }).format(session.date)}
                    {session.location ? ` · ${session.location}` : ""}
                  </p>
                </div>
                <span className="whitespace-nowrap text-sm text-stone-500">
                  {anwesend} / {session.attendances.length} anwesend
                </span>
              </Link>
            </li>
          );
        })}
        {sessions.length === 0 && (
          <li className="px-6 py-8 text-center text-sm text-stone-500">
            {emptyText}
          </li>
        )}
      </ul>
    </div>
  );
}
