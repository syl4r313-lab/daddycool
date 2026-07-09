"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";
import { generateAccessCode, suggestNextFruit } from "@/lib/fruits";

export type ActionState = {
  error?: string;
  success?: string;
  generatedCode?: string;
  fruitName?: string;
} | null;

const participantSchema = z.object({
  realName: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export async function createParticipantAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireStaff();

  const parsed = participantSchema.safeParse({
    realName: formData.get("realName") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const existing = await prisma.participant.findMany({
    select: { fruitName: true },
  });
  const fruit = suggestNextFruit(existing.map((p) => p.fruitName));
  const code = generateAccessCode();
  const codeHash = await bcrypt.hash(code, 10);

  await prisma.participant.create({
    data: {
      fruitName: fruit.name,
      fruitEmoji: fruit.emoji,
      realName: parsed.data.realName || null,
      notes: parsed.data.notes || null,
      codeHash,
    },
  });

  revalidatePath("/team/teilnehmende");
  return {
    success: `${fruit.emoji} ${fruit.name} wurde angelegt.`,
    generatedCode: code,
    fruitName: fruit.name,
  };
}

export async function updateParticipantAction(
  participantId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireStaff();

  const parsed = participantSchema.safeParse({
    realName: formData.get("realName") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  await prisma.participant.update({
    where: { id: participantId },
    data: {
      realName: parsed.data.realName || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath(`/team/teilnehmende/${participantId}`);
  return { success: "Gespeichert." };
}

export async function resetParticipantCodeAction(
  participantId: string,
  _prevState: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  await requireStaff();

  const code = generateAccessCode();
  const codeHash = await bcrypt.hash(code, 10);
  await prisma.participant.update({
    where: { id: participantId },
    data: { codeHash },
  });

  revalidatePath(`/team/teilnehmende/${participantId}`);
  return { success: "Neuer Zugangscode erstellt.", generatedCode: code };
}

export async function toggleParticipantActiveAction(
  participantId: string,
  active: boolean,
) {
  await requireStaff();
  await prisma.participant.update({
    where: { id: participantId },
    data: { active },
  });
  revalidatePath(`/team/teilnehmende/${participantId}`);
  revalidatePath("/team/teilnehmende");
}
