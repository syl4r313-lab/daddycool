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
          ? "border-stone-400 text-stone-700 hover:bg-stone-100"
          : "border-brand-300 bg-brand-50 text-brand-800 hover:bg-brand-100"
      }`}
    >
      {isPending ? "Bitte warten…" : active ? "Als inaktiv markieren" : "Wieder aktivieren"}
    </button>
  );
}
