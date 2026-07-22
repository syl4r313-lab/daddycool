import type { Attendance, ProgramSession } from "@/generated/prisma/client";

export const SITZUNGEN_GESAMT = 8;
// Interview + Einzelgespräch + 8 Sitzungen + Abschluss
export const TERMINE_GESAMT = SITZUNGEN_GESAMT + 3;

export type AttendanceWithSession = Attendance & { session: ProgramSession };

export type ProgramProgress = {
  interviewAbsolviert: boolean;
  einzelgespraechAbsolviert: boolean;
  sitzungenAbsolviert: number;
  sitzungenGesamt: number;
  abschlussAbsolviert: boolean;
  gesamtAbsolviert: number;
  gesamtTermine: number;
  prozent: number;
  zertifikatErreicht: boolean;
};

export function computeProgress(
  attendances: AttendanceWithSession[],
): ProgramProgress {
  const attended = attendances.filter((a) => a.status === "ANWESEND");

  const interviewAbsolviert = attended.some(
    (a) => a.session.type === "INTERVIEW",
  );
  const einzelgespraechAbsolviert = attended.some(
    (a) => a.session.type === "EINZELGESPRAECH",
  );
  const sitzungenAbsolviert = attended.filter(
    (a) => a.session.type === "SITZUNG",
  ).length;
  const abschlussAbsolviert = attended.some(
    (a) => a.session.type === "ABSCHLUSS",
  );

  const gesamtAbsolviert =
    (interviewAbsolviert ? 1 : 0) +
    (einzelgespraechAbsolviert ? 1 : 0) +
    sitzungenAbsolviert +
    (abschlussAbsolviert ? 1 : 0);

  return {
    interviewAbsolviert,
    einzelgespraechAbsolviert,
    sitzungenAbsolviert,
    sitzungenGesamt: SITZUNGEN_GESAMT,
    abschlussAbsolviert,
    gesamtAbsolviert,
    gesamtTermine: TERMINE_GESAMT,
    prozent: Math.round((gesamtAbsolviert / TERMINE_GESAMT) * 100),
    zertifikatErreicht: gesamtAbsolviert === TERMINE_GESAMT,
  };
}

export function sessionLabel(session: Pick<ProgramSession, "type" | "sitzungNummer">) {
  if (session.type === "INTERVIEW") return "Erstgespräch";
  if (session.type === "EINZELGESPRAECH") return "Einzelgespräch";
  if (session.type === "ABSCHLUSS") return "Abschlussgespräch";
  return `Sitzung ${session.sitzungNummer ?? "?"} von ${SITZUNGEN_GESAMT}`;
}
