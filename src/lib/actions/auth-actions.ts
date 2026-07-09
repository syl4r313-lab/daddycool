"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createParticipantSession,
  createStaffSession,
  destroyParticipantSession,
  destroyStaffSession,
} from "@/lib/session";

export type ActionState = { error?: string } | null;

const staffLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email("Bitte eine gültige E-Mail-Adresse eingeben.")),
  password: z.string().min(1, "Bitte Passwort eingeben."),
});

export async function loginStaffAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = staffLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const staff = await prisma.staff.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!staff) {
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  const passwordOk = await bcrypt.compare(
    parsed.data.password,
    staff.passwordHash,
  );
  if (!passwordOk) {
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  await createStaffSession(staff.id);
  redirect("/team");
}

const participantLoginSchema = z.object({
  code: z
    .string()
    .trim()
    .min(4, "Der Zugangscode ist zu kurz.")
    .max(20, "Der Zugangscode ist zu lang."),
});

export async function loginParticipantAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = participantLoginSchema.safeParse({
    code: formData.get("code"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }

  const participants = await prisma.participant.findMany({
    where: { active: true },
  });

  for (const participant of participants) {
    const ok = await bcrypt.compare(parsed.data.code, participant.codeHash);
    if (ok) {
      await createParticipantSession(participant.id);
      redirect("/programm");
    }
  }

  return { error: "Zugangscode nicht gefunden. Bitte bei den Betreuenden nachfragen." };
}

export async function logoutStaffAction() {
  "use server";
  await destroyStaffSession();
  redirect("/");
}

export async function logoutParticipantAction() {
  "use server";
  await destroyParticipantSession();
  redirect("/");
}
