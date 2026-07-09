import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { markThreadReadByStaff } from "@/lib/actions/message-actions";
import { MessageThread } from "@/components/MessageThread";
import { StaffReplyForm } from "@/components/StaffReplyForm";

export default async function StaffThreadPage({
  params,
}: {
  params: Promise<{ participantId: string }>;
}) {
  const { participantId } = await params;
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
  });
  if (!participant) notFound();

  await markThreadReadByStaff(participantId);

  const messages = await prisma.message.findMany({
    where: { participantId },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-4">
      <Link href="/team/nachrichten" className="text-sm text-brand-700 hover:underline">
        ← Alle Nachrichten
      </Link>
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-stone-200 px-6 py-4">
          <span className="text-2xl">{participant.fruitEmoji}</span>
          <h1 className="font-semibold text-stone-900">{participant.fruitName}</h1>
        </div>
        <MessageThread messages={messages} viewerRole="BETREUER" />
        <div className="border-t border-stone-200 p-6">
          <StaffReplyForm participantId={participant.id} />
        </div>
      </div>
    </div>
  );
}
