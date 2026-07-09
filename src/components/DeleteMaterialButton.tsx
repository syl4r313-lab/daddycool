"use client";

import { useTransition } from "react";
import { deleteMaterialAction } from "@/lib/actions/material-actions";

export function DeleteMaterialButton({ materialId }: { materialId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (confirm("Dieses Material wirklich löschen?")) {
          startTransition(() => {
            deleteMaterialAction(materialId);
          });
        }
      }}
      className="text-sm text-red-600 hover:underline disabled:opacity-60"
    >
      {isPending ? "Wird gelöscht…" : "Löschen"}
    </button>
  );
}
