import type { CSSProperties } from "react";

/**
 * Daddy Cool Logo: Kreis-Mark (zwei Punkte mit Lücke) plus Wortmarke
 * "Daddy" (Anthrazit) + "Cool" (Grau). Als Inline-SVG umgesetzt, damit es
 * gestochen scharf skaliert und die Markenfarbe über currentColor erbt.
 */
export function Logo({
  iconSize = 28,
  showWordmark = true,
  className = "",
  wordmarkClassName = "",
}: {
  iconSize?: number;
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}) {
  const style: CSSProperties = { width: iconSize, height: iconSize };
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        style={style}
        className="shrink-0 text-brand-700"
        aria-hidden="true"
      >
        <mask id="daddycool-mark">
          <rect width="40" height="40" fill="black" />
          <circle cx="15" cy="18" r="12.5" fill="white" />
          <circle cx="29" cy="27" r="8.5" fill="black" />
          <circle cx="29" cy="27" r="6" fill="white" />
        </mask>
        <rect
          width="40"
          height="40"
          fill="currentColor"
          mask="url(#daddycool-mark)"
        />
      </svg>
      {showWordmark && (
        <span
          className={`text-xl font-bold tracking-tight ${wordmarkClassName}`}
        >
          <span className="text-brand-800">Daddy</span>
          <span className="text-brand-400">Cool</span>
        </span>
      )}
    </span>
  );
}
