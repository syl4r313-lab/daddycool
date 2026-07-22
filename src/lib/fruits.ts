// Anonymisierungs-Label für Teilnehmende: Automarken statt Klarnamen.
// (Interne Bezeichnung "FRUITS" bleibt aus Kompatibilitätsgründen erhalten.)
export const FRUITS: { name: string; emoji: string }[] = [
  { name: "Volkswagen", emoji: "🚗" },
  { name: "Mercedes", emoji: "🚙" },
  { name: "BMW", emoji: "🏎️" },
  { name: "Audi", emoji: "🚘" },
  { name: "Porsche", emoji: "🏎️" },
  { name: "Opel", emoji: "🚗" },
  { name: "Ford", emoji: "🚙" },
  { name: "Škoda", emoji: "🚗" },
  { name: "Tesla", emoji: "🚘" },
  { name: "Toyota", emoji: "🚙" },
  { name: "Volvo", emoji: "🚗" },
  { name: "Renault", emoji: "🚙" },
  { name: "Peugeot", emoji: "🚗" },
  { name: "Fiat", emoji: "🚗" },
  { name: "Seat", emoji: "🚗" },
  { name: "Mazda", emoji: "🏎️" },
  { name: "Nissan", emoji: "🚙" },
  { name: "Hyundai", emoji: "🚗" },
  { name: "Kia", emoji: "🚗" },
  { name: "Mini", emoji: "🚗" },
  { name: "Jaguar", emoji: "🚘" },
  { name: "Citroën", emoji: "🚗" },
];

/** Liefert die nächste freie Automarke (inkl. Zähler, falls die Liste erschöpft ist). */
export function suggestNextFruit(usedFruitNames: string[]): {
  name: string;
  emoji: string;
} {
  for (const fruit of FRUITS) {
    if (!usedFruitNames.includes(fruit.name)) {
      return fruit;
    }
  }
  // Alle Marken vergeben: mit Zähler weiterzählen (Volkswagen 2, Volkswagen 3, ...)
  let counter = 2;
  while (true) {
    for (const fruit of FRUITS) {
      const candidate = `${fruit.name} ${counter}`;
      if (!usedFruitNames.includes(candidate)) {
        return { name: candidate, emoji: fruit.emoji };
      }
    }
    counter += 1;
  }
}

/** Generiert einen gut lesbaren 6-stelligen numerischen Zugangscode. */
export function generateAccessCode(): string {
  const min = 100000;
  const max = 999999;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}
