import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function NachrichtenPage() {
  const [withMessages, allActive] = await Promise.all([
    prisma.participant.findMany({
      where: { messages: { some: {} } },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        _count: {
          select: {
            messages: { where: { sender: "TEILNEHMER", readByStaff: false } },
          },
        },
      },
    }),
    prisma.participant.findMany({
      where: { active: true, messages: { none: {} } },
      orderBy: { fruitName: "asc" },
    }),
  ]);

  withMessages.sort((a, b) => {
    const aDate = a.messages[0]?.createdAt.getTime() ?? 0;
    const bDate = b.messages[0]?.createdAt.getTime() ?? 0;
    return bDate - aDate;
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4">
          <h1 className="font-semibold text-stone-900">Nachrichten</h1>
          <p className="text-sm text-stone-500">
            Teilnehmende schreiben anonym über ihre zugeteilte Automarke.
          </p>
        </div>
        <ul className="divide-y divide-stone-100">
          {withMessages.map((p) => {
            const last = p.messages[0];
            const unread = p._count.messages;
            return (
              <li key={p.id}>
                <Link
                  href={`/team/nachrichten/${p.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50"
                >
                  <span className="text-2xl">{p.fruitEmoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900">{p.fruitName}</span>
                      {unread > 0 && (
                        <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-medium text-white">
                          {unread} neu
                        </span>
                      )}
                    </div>
                    {last && (
                      <p className="truncate text-sm text-stone-500">
                        {last.sender === "BETREUER" ? "Du: " : ""}
                        {last.body}
                      </p>
                    )}
                  </div>
                  {last && (
                    <span className="whitespace-nowrap text-xs text-stone-400">
                      {new Intl.DateTimeFormat("de-DE", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(last.createdAt)}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
          {withMessages.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-stone-500">
              Noch keine Nachrichten vorhanden.
            </li>
          )}
        </ul>
      </div>

      {allActive.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-6 py-4">
            <h2 className="font-semibold text-stone-900">
              Neue Unterhaltung starten
            </h2>
          </div>
          <ul className="flex flex-wrap gap-2 p-6">
            {allActive.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/team/nachrichten/${p.id}`}
                  className="flex items-center gap-1.5 rounded-full border border-stone-200 px-3 py-1.5 text-sm hover:border-brand-300 hover:bg-brand-50"
                >
                  <span>{p.fruitEmoji}</span>
                  <span>{p.fruitName}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
