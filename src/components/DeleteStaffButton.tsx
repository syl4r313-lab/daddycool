"use client";

import { useTransition } from "react";
import { deleteStaffAction } from "@/lib/actions/staff-actions";

export function DeleteStaffButton({
  staffId,
  staffName,
}: {
  staffId: string;
  staffName: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (
          confirm(
            `${staffName} wirklich als Betreuer:in entfernen? Der Zugang wird sofort ungültig.`,
          )
        ) {
          startTransition(() => {
            deleteStaffAction(staffId);
          });
        }
      }}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
    >
      {isPending ? "Wird entfernt…" : "Entfernen"}
    </button>
  );
}
