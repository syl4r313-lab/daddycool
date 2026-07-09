"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireParticipant, requireStaff } from "@/lib/auth";

export type ActionState = { error?: string } | null;

const messageSchema = z.object({
  body: z.string().trim().min(1, "Bitte eine Nachricht eingeben.").max(4000),
});

export async function sendParticipantMessageAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const participant = await requireParticipant();

  const parsed = messageSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  await prisma.message.create({
    data: {
      participantId: participant.id,
      sender: "TEILNEHMER",
      body: parsed.data.body,
      readByParticipant: true,
    },
  });

  revalidatePath("/programm/kontakt");
  revalidatePath("/team/nachrichten");
  return null;
}

export async function sendStaffMessageAction(
  participantId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const staff = await requireStaff();

  const parsed = messageSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  await prisma.message.create({
    data: {
      participantId,
      staffId: staff.id,
      sender: "BETREUER",
      body: parsed.data.body,
      readByStaff: true,
    },
  });

  revalidatePath("/programm/kontakt");
  revalidatePath(`/team/nachrichten/${participantId}`);
  revalidatePath("/team/nachrichten");
  return null;
}

// Called during render of the thread pages (not as a form action), so this
// must not call revalidatePath - Next.js disallows cache revalidation while
// rendering. The pages already fetch fresh data on every request.
export async function markThreadReadByStaff(participantId: string) {
  await requireStaff();
  await prisma.message.updateMany({
    where: { participantId, sender: "TEILNEHMER", readByStaff: false },
    data: { readByStaff: true },
  });
}

export async function markThreadReadByParticipant() {
  const participant = await requireParticipant();
  await prisma.message.updateMany({
    where: {
      participantId: participant.id,
      sender: "BETREUER",
      readByParticipant: false,
    },
    data: { readByParticipant: true },
  });
}
