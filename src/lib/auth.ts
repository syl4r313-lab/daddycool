import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getParticipantSession, getStaffSession } from "@/lib/session";

export async function getCurrentStaff() {
  const session = await getStaffSession();
  if (!session) return null;
  return prisma.staff.findUnique({ where: { id: session.staffId } });
}

export async function requireStaff() {
  const staff = await getCurrentStaff();
  if (!staff) {
    redirect("/anmelden/team");
  }
  return staff;
}

export async function getCurrentParticipant() {
  const session = await getParticipantSession();
  if (!session) return null;
  return prisma.participant.findUnique({
    where: { id: session.participantId },
  });
}

export async function requireParticipant() {
  const participant = await getCurrentParticipant();
  if (!participant || !participant.active) {
    redirect("/anmelden/programm");
  }
  return participant;
}
