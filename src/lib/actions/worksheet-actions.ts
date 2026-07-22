"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireParticipant } from "@/lib/auth";
import { getWorksheet, type WorksheetAnswers } from "@/lib/worksheets";

export type ActionState = { error?: string; success?: string } | null;

export async function saveWorksheetAction(
  worksheetKey: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const participant = await requireParticipant();

  const worksheet = getWorksheet(worksheetKey);
  if (!worksheet) {
    return { error: "Arbeitsblatt nicht gefunden." };
  }

  const answers: WorksheetAnswers = {};
  for (const field of worksheet.fields) {
    const raw = formData.get(field.key);
    if (field.type === "scale") {
      if (raw === null || raw === "") continue;
      const num = Number(raw);
      if (Number.isNaN(num)) continue;
      const min = field.min ?? 0;
      const max = field.max ?? 10;
      answers[field.key] = Math.min(max, Math.max(min, Math.round(num)));
    } else {
      const text = typeof raw === "string" ? raw.trim() : "";
      if (text.length === 0) continue;
      answers[field.key] = text.slice(0, 5000);
    }
  }

  await prisma.worksheetResponse.upsert({
    where: {
      participantId_worksheetKey: {
        participantId: participant.id,
        worksheetKey,
      },
    },
    update: { answers },
    create: { participantId: participant.id, worksheetKey, answers },
  });

  revalidatePath("/programm/mitarbeit");
  revalidatePath(`/programm/mitarbeit/${worksheetKey}`);
  return { success: "Gespeichert. Du kannst deine Antworten jederzeit ändern." };
}
