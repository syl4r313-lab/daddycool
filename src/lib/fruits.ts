export const FRUITS: { name: string; emoji: string }[] = [
  { name: "Apfel", emoji: "🍎" },
  { name: "Birne", emoji: "🍐" },
  { name: "Kirsche", emoji: "🍒" },
  { name: "Traube", emoji: "🍇" },
  { name: "Pfirsich", emoji: "🍑" },
  { name: "Zitrone", emoji: "🍋" },
  { name: "Orange", emoji: "🍊" },
  { name: "Ananas", emoji: "🍍" },
  { name: "Mango", emoji: "🥭" },
  { name: "Kiwi", emoji: "🥝" },
  { name: "Melone", emoji: "🍈" },
  { name: "Wassermelone", emoji: "🍉" },
  { name: "Erdbeere", emoji: "🍓" },
  { name: "Heidelbeere", emoji: "🫐" },
  { name: "Kokosnuss", emoji: "🥥" },
  { name: "Banane", emoji: "🍌" },
  { name: "Limette", emoji: "🍋‍🟩" },
  { name: "Olive", emoji: "🫒" },
  { name: "Feige", emoji: "🌰" },
  { name: "Litschi", emoji: "🍑" },
];

/** Liefert die nächste freie Frucht (inkl. Zähler, falls die Liste erschöpft ist). */
export function suggestNextFruit(usedFruitNames: string[]): {
  name: string;
  emoji: string;
} {
  for (const fruit of FRUITS) {
    if (!usedFruitNames.includes(fruit.name)) {
      return fruit;
    }
  }
  // Alle Basisfrüchte vergeben: mit Zähler weiterzählen (Apfel 2, Apfel 3, ...)
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
