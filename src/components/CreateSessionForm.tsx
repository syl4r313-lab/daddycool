"use client";

import { useActionState, useState } from "react";
import { createSessionAction } from "@/lib/actions/session-actions";
import { SubmitButton } from "@/components/SubmitButton";

export function CreateSessionForm({ nextSitzungNummer }: { nextSitzungNummer: number }) {
  const [state, formAction] = useActionState(createSessionAction, null);
  const [type, setType] = useState<"INTERVIEW" | "SITZUNG" | "ABSCHLUSS">(
    "SITZUNG",
  );

  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="font-semibold text-stone-900">Neuen Termin anlegen</h2>
      <form action={formAction} className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-stone-700">
            Art des Termins
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          >
            <option value="INTERVIEW">Erstgespräch</option>
            <option value="SITZUNG">Sitzung</option>
            <option value="ABSCHLUSS">Abschlussgespräch</option>
          </select>
        </div>
        {type === "SITZUNG" && (
          <div>
            <label htmlFor="sitzungNummer" className="block text-sm font-medium text-stone-700">
              Sitzungsnummer (1-8)
            </label>
            <input
              id="sitzungNummer"
              name="sitzungNummer"
              type="number"
              min={1}
              max={8}
              defaultValue={nextSitzungNummer}
              className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
            />
          </div>
        )}
        <div className={type === "SITZUNG" ? "" : "sm:col-span-2"}>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700">
            Titel
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="z. B. Gruppensitzung"
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-stone-700">
            Datum &amp; Uhrzeit
          </label>
          <input
            id="date"
            name="date"
            type="datetime-local"
            required
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-stone-700">
            Ort (optional)
          </label>
          <input
            id="location"
            name="location"
            type="text"
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-stone-700">
            Notiz (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            className="mt-1 w-full rounded-lg border border-stone-400 px-3 py-2 focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          />
        </div>
        {state?.error && (
          <p className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        )}
        <div className="sm:col-span-2">
          <SubmitButton>Termin anlegen</SubmitButton>
        </div>
      </form>
    </div>
  );
}
