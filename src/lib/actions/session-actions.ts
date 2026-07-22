"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/auth";
import type { AttendanceStatus, SessionType } from "@/generated/prisma/client";

export type ActionState = { error?: string; success?: string } | null;

const sessionSchema = z.object({
  type: z.enum(["INTERVIEW", "EINZELGESPRAECH", "SITZUNG", "ABSCHLUSS"]),
  sitzungNummer: z.coerce.number().int().min(1).max(8).optional(),
  title: z.string().trim().min(1, "Bitte einen Titel angeben."),
  date: z.string().min(1, "Bitte Datum und Uhrzeit angeben."),
  location: z.string().trim().max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export async function createSessionAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireStaff();

  const parsed = sessionSchema.safeParse({
    type: formData.get("type"),
    sitzungNummer: formData.get("sitzungNummer") || undefined,
    title: formData.get("title"),
    date: formData.get("date"),
    location: formData.get("location") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Ungültige Eingabe." };
  }
  const { type, sitzungNummer, title, date, location, notes } = parsed.data;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return { error: "Ungültiges Datum." };
  }
  if (type === "SITZUNG" && !sitzungNummer) {
    return { error: "Bitte die Sitzungsnummer (1-8) angeben." };
  }

  const session = await prisma.programSession.create({
    data: {
      type: type as SessionType,
      sitzungNummer: type === "SITZUNG" ? sitzungNummer : null,
      title,
      date: parsedDate,
      location: location || null,
      notes: notes || null,
    },
  });

  const participants = await prisma.participant.findMany({
    where: { active: true },
    select: { id: true },
  });
  if (participants.length > 0) {
    await prisma.attendance.createMany({
      data: participants.map((p) => ({
        participantId: p.id,
        sessionId: session.id,
      })),
    });
  }

  revalidatePath("/team/kalender");
  revalidatePath("/programm/kalender");
  revalidatePath("/programm");
  redirect(`/team/kalender/${session.id}`);
}

export async function deleteSessionAction(sessionId: string) {
  await requireStaff();
  await prisma.programSession.delete({ where: { id: sessionId } });
  revalidatePath("/team/kalender");
  revalidatePath("/programm/kalender");
  revalidatePath("/programm");
  redirect("/team/kalender");
}

export async function setAttendanceAction(
  sessionId: string,
  participantId: string,
  status: AttendanceStatus,
) {
  await requireStaff();
  await prisma.attendance.upsert({
    where: { participantId_sessionId: { participantId, sessionId } },
    update: { status },
    create: { participantId, sessionId, status },
  });
  revalidatePath(`/team/kalender/${sessionId}`);
  revalidatePath("/team/teilnehmende");
  revalidatePath("/programm");
  revalidatePath("/programm/kalender");
}
