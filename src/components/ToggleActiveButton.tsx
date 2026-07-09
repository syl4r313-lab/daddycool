"use client";

import { useTransition } from "react";
import { toggleParticipantActiveAction } from "@/lib/actions/participant-actions";

export function ToggleActiveButton({
  participantId,
  active,
}: {
  participantId: string;
  active: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          toggleParticipantActiveAction(participantId, !active);
        })
      }
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium disabled:opacity-60 ${
        active
          ? "border-stone-300 text-stone-700 hover:bg-stone-100"
          : "border-teal-300 bg-teal-50 text-teal-800 hover:bg-teal-100"
      }`}
    >
      {isPending ? "Bitte warten…" : active ? "Als inaktiv markieren" : "Wieder aktivieren"}
    </button>
  );
}
