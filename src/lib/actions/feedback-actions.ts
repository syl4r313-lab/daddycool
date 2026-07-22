"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireParticipant, requireStaff } from "@/lib/auth";

export type ActionState = { error?: string; success?: string } | null;

const feedbackSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Bitte schreibe dein Feedback.")
    .max(5000),
});

export async function sendFeedbackAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const participant = await requireParticipant();

  const parsed = feedbackSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  await prisma.feedback.create({
    data: { participantId: participant.id, body: parsed.data.body },
  });

  revalidatePath("/programm/feedback");
  revalidatePath("/team/feedback");
  return {
    success: "Danke für dein Feedback! Es wurde an die Betreuenden übermittelt.",
  };
}

// Wird während des Renderns der Team-Feedback-Seite aufgerufen – darf daher
// kein revalidatePath auslösen (analog zu den Nachrichten).
export async function markFeedbackReadByStaff() {
  await requireStaff();
  await prisma.feedback.updateMany({
    where: { readByStaff: false },
    data: { readByStaff: true },
  });
}
