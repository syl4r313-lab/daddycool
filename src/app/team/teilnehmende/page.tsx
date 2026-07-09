import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { computeProgress } from "@/lib/progress";
import { CreateParticipantForm } from "@/components/CreateParticipantForm";
import { ProgressBar } from "@/components/ProgressBar";

export default async function TeilnehmendePage() {
  const participants = await prisma.participant.findMany({
    orderBy: { createdAt: "asc" },
    include: { attendances: { include: { session: true } } },
  });

  return (
    <div className="space-y-6">
      <CreateParticipantForm />

      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="border-b border-stone-200 px-6 py-4">
          <h2 className="font-semibold text-stone-900">
            Teilnehmende ({participants.length})
          </h2>
        </div>
        <ul className="divide-y divide-stone-100">
          {participants.map((participant) => {
            const progress = computeProgress(participant.attendances);
            return (
              <li key={participant.id}>
                <Link
                  href={`/team/teilnehmende/${participant.id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50"
                >
                  <span className="text-2xl">{participant.fruitEmoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900">
                        {participant.fruitName}
                      </span>
                      {!participant.active && (
                        <span className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-stone-600">
                          inaktiv
                        </span>
                      )}
                      {progress.zertifikatErreicht && (
                        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-800">
                          Zertifikat bereit
                        </span>
                      )}
                    </div>
                    <div className="mt-1 max-w-xs">
                      <ProgressBar percent={progress.prozent} />
                    </div>
                  </div>
                  <span className="text-sm text-stone-500">
                    {progress.gesamtAbsolviert} / {progress.gesamtTermine}
                  </span>
                </Link>
              </li>
            );
          })}
          {participants.length === 0 && (
            <li className="px-6 py-8 text-center text-sm text-stone-500">
              Noch keine Teilnehmenden angelegt.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
