"use client";

import { useState } from "react";

/**
 * Urheber-Hinweis für das Onboarding: zeigt das KUMA-Consulting-Logo aus
 * public/kuma-consulting.png. Ist die Datei (noch) nicht vorhanden, wird das
 * Bild sauber ausgeblendet und stattdessen der Schriftzug angezeigt – so gibt
 * es nie ein kaputtes Bild-Icon.
 */
export function CreatedByCredit({ className = "" }: { className?: string }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <p className="text-[11px] font-medium uppercase tracking-widest text-stone-400">
        Erstellt von
      </p>
      {imgOk ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src="/kuma-consulting.png"
          alt="KUMA Consulting"
          className="h-auto w-52 object-contain sm:w-60"
          onError={() => setImgOk(false)}
        />
      ) : (
        <span className="text-base font-bold tracking-tight">
          <span className="text-[#20486b]">KUMA</span>{" "}
          <span className="tracking-[0.2em] text-stone-500">CONSULTING</span>
        </span>
      )}
    </div>
  );
}
