"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";

export type ActionState = { error?: string; success?: string } | null;

const createStaffSchema = z.object({
  name: z.string().trim().min(1, "Bitte einen Namen angeben.").max(200),
  email: z
    .string()
    .trim()
    .pipe(z.email("Bitte eine gültige E-Mail-Adresse eingeben.")),
  password: z
    .string()
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
    .max(200),
});

export async function createStaffAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireStaff();

  const parsed = createStaffSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.staff.findUnique({ where: { email } });
  if (existing) {
    return { error: "Diese E-Mail-Adresse wird bereits verwendet." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.staff.create({
    data: { name: parsed.data.name, email, passwordHash },
  });

  revalidatePath("/team/betreuende");
  return {
    success: `${parsed.data.name} wurde als Betreuer:in angelegt. Bitte E-Mail und Passwort direkt weitergeben.`,
  };
}

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
    .max(200),
});

export async function resetStaffPasswordAction(
  staffId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireStaff();

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.staff.update({
    where: { id: staffId },
    data: { passwordHash },
  });

  revalidatePath("/team/betreuende");
  return { success: "Neues Passwort gesetzt." };
}

export async function deleteStaffAction(staffId: string) {
  const current = await requireStaff();
  // Sich selbst kann man nicht entfernen – dadurch bleibt immer mindestens
  // ein Team-Zugang bestehen.
  if (staffId === current.id) return;

  await prisma.staff.delete({ where: { id: staffId } });
  revalidatePath("/team/betreuende");
}
