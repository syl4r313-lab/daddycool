import { requireParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markThreadReadByParticipant } from "@/lib/actions/message-actions";
import { MessageThread } from "@/components/MessageThread";
import { ParticipantReplyForm } from "@/components/ParticipantReplyForm";

export default async function KontaktPage() {
  const participant = await requireParticipant();
  await markThreadReadByParticipant();

  const messages = await prisma.message.findMany({
    where: { participantId: participant.id },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Kontakt</h1>
        <p className="text-sm text-stone-500">
          Schreib den Betreuenden eine Nachricht. Sie sehen dabei nur deine
          Frucht – nie deinen Namen.
        </p>
      </div>
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <MessageThread messages={messages} viewerRole="TEILNEHMER" />
        <div className="border-t border-stone-200 p-6">
          <ParticipantReplyForm />
        </div>
      </div>
    </div>
  );
}
