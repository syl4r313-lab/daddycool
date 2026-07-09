"use client";

import { useActionState } from "react";
import { resetParticipantCodeAction } from "@/lib/actions/participant-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function ResetCodeButton({ participantId }: { participantId: string }) {
  const action = resetParticipantCodeAction.bind(null, participantId);
  const [state, formAction] = useActionState(action, null);

  return (
    <form action={formAction} className="space-y-2">
      <SubmitButton className="bg-stone-700 hover:bg-stone-800">
        Neuen Zugangscode erstellen
      </SubmitButton>
      {state?.generatedCode && (
        <div className="rounded-lg border border-brand-300 bg-brand-50 px-4 py-3">
          <p className="text-sm text-brand-900">
            Neuer Zugangscode (bitte jetzt notieren, wird nicht erneut
            angezeigt):
          </p>
          <p className="mt-1 text-2xl font-bold tracking-widest text-brand-900">
            {state.generatedCode}
          </p>
        </div>
      )}
    </form>
  );
}
