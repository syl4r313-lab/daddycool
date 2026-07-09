"use client";

import { useTransition } from "react";
import { deleteSessionAction } from "@/lib/actions/session-actions";

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Diesen Termin wirklich löschen? Alle Anwesenheitsdaten dazu gehen verloren.")) {
          startTransition(() => {
            deleteSessionAction(sessionId);
          });
        }
      }}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {isPending ? "Wird gelöscht…" : "Termin löschen"}
    </button>
  );
}
