"use client";

import { useTransition } from "react";
import { setAttendanceAction } from "@/lib/actions/session-actions";
import type { AttendanceStatus } from "@/generated/prisma/client";

const OPTIONS: { status: AttendanceStatus; label: string }[] = [
  { status: "OFFEN", label: "Offen" },
  { status: "ANWESEND", label: "Anwesend" },
  { status: "ENTSCHULDIGT", label: "Entschuldigt" },
  { status: "UNENTSCHULDIGT", label: "Unentschuldigt" },
];

export function AttendanceControl({
  sessionId,
  participantId,
  status,
}: {
  sessionId: string;
  participantId: string;
  status: AttendanceStatus;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-1.5">
      {OPTIONS.map((option) => (
        <button
          key={option.status}
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              setAttendanceAction(sessionId, participantId, option.status);
            })
          }
          className={`rounded-full border px-2.5 py-1 text-xs font-medium transition disabled:opacity-60 ${
            status === option.status
              ? optionActiveClass(option.status)
              : "border-stone-200 text-stone-500 hover:bg-stone-100"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function optionActiveClass(status: AttendanceStatus) {
  switch (status) {
    case "ANWESEND":
      return "border-brand-400 bg-brand-100 text-brand-800";
    case "UNENTSCHULDIGT":
      return "border-red-300 bg-red-100 text-red-700";
    case "ENTSCHULDIGT":
      return "border-amber-300 bg-amber-100 text-amber-800";
    default:
      return "border-stone-400 bg-stone-100 text-stone-700";
  }
}
