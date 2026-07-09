import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sessionLabel } from "@/lib/progress";
import { AttendanceControl } from "@/components/AttendanceControl";
import { DeleteSessionButton } from "@/components/DeleteSessionButton";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await prisma.programSession.findUnique({
    where: { id },
    include: {
      attendances: {
        include: { participant: true },
        orderBy: { participant: { fruitName: "asc" } },
      },
    },
  });
  if (!session) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">
            {sessionLabel(session)}
          </p>
          <h1 className="text-xl font-semibold text-stone-900">{session.title}</h1>
          <p className="text-sm text-stone-500">
            {new Intl.DateTimeFormat("de-DE", {
              dateStyle: "full",
              timeStyle: "short",
            }).format(session.date)}
            {session.location ? ` · ${session.location}` : ""}
          </p>
          {session.notes && (
            <p className="mt-2 max-w-xl text-sm text-stone-600">{session.notes}</p>
          )}
        </div>
        <DeleteSessionButton sessionId={session.id} />
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4">
          <h2 className="font-semibold text-stone-900">Anwesenheit</h2>
        </div>
        <ul className="divide-y divide-stone-100">
          {session.attendances.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{a.participant.fruitEmoji}</span>
                <span className="font-medium text-stone-800">
                  {a.participant.fruitName}
                </span>
              </div>
              <AttendanceControl
                sessionId={session.id}
                participantId={a.participantId}
                status={a.status}
              />
            </li>
          ))}
          {session.attendances.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-stone-500">
              Keine aktiven Teilnehmenden zum Zeitpunkt der Terminerstellung.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
