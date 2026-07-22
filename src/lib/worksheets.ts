// Interaktive Arbeitsblätter für den Bereich "Mitarbeit".
// Die Fragen sind eigenständig formuliert und an etablierte Ansätze der
// Täter-/Verhaltensarbeit angelehnt (Motivational Interviewing, kognitiv-
// behaviorale Rückfallprävention, Verantwortungsübernahme, Perspektivwechsel).
// Reihenfolge = Empfehlung für den Programmverlauf.

export type WorksheetFieldType = "scale" | "longtext";

export type WorksheetField = {
  key: string;
  label: string;
  type: WorksheetFieldType;
  help?: string;
  // nur für type "scale":
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
};

export type Worksheet = {
  key: string;
  title: string;
  intro: string;
  fields: WorksheetField[];
};

export const WORKSHEETS: Worksheet[] = [
  {
    key: "motivation",
    title: "Motivation & Veränderungsbereitschaft",
    intro:
      "Ordne dich ehrlich ein – es gibt kein richtig oder falsch. Es geht darum, wo du gerade stehst.",
    fields: [
      {
        key: "motivation_level",
        label: "Wie motiviert bist du im Moment, etwas an deinem Verhalten zu verändern?",
        type: "scale",
        min: 0,
        max: 10,
        minLabel: "gar nicht",
        maxLabel: "sehr stark",
      },
      {
        key: "confidence_level",
        label: "Wie zuversichtlich bist du, dass du eine Veränderung schaffen kannst?",
        type: "scale",
        min: 0,
        max: 10,
        minLabel: "gar nicht",
        maxLabel: "sehr sicher",
      },
      {
        key: "one_point_up",
        label:
          "Was müsste passieren, damit deine Motivation um einen Punkt höher liegt?",
        type: "longtext",
      },
    ],
  },
  {
    key: "trigger",
    title: "Meine Auslöser (Trigger)",
    intro:
      "Wenn du deine Auslöser kennst, kannst du früher gegensteuern. Nimm dir Zeit für die Fragen.",
    fields: [
      {
        key: "situations",
        label:
          "In welchen Situationen gerätst du am ehesten unter Druck, Wut oder Anspannung?",
        type: "longtext",
      },
      {
        key: "feelings_before",
        label: "Welche Gefühle nimmst du kurz vorher wahr?",
        type: "longtext",
      },
      {
        key: "body_signals",
        label:
          "Woran merkst du körperlich, dass es „eng“ wird? (z. B. Herzklopfen, Enge, Hitze)",
        type: "longtext",
        help: "Das sind deine Frühwarnzeichen.",
      },
    ],
  },
  {
    key: "ziele",
    title: "Meine Ziele im Programm",
    intro: "Konkrete Ziele helfen dir, deinen Fortschritt zu erkennen.",
    fields: [
      {
        key: "target_behavior",
        label: "An welchem konkreten Verhalten möchtest du arbeiten?",
        type: "longtext",
      },
      {
        key: "success_signs",
        label: "Woran würdest du merken, dass sich etwas verbessert hat?",
        type: "longtext",
      },
      {
        key: "importance",
        label: "Wie wichtig ist dir dieses Ziel?",
        type: "scale",
        min: 0,
        max: 10,
        minLabel: "unwichtig",
        maxLabel: "sehr wichtig",
      },
    ],
  },
  {
    key: "erwartungen",
    title: "Erwartungen an das Programm",
    intro: "Was du dir wünschst und was dich beschäftigt, ist hier gefragt.",
    fields: [
      {
        key: "hopes",
        label: "Was versprichst du dir von der Teilnahme?",
        type: "longtext",
      },
      {
        key: "worries",
        label: "Was befürchtest du vielleicht?",
        type: "longtext",
      },
      {
        key: "needs",
        label: "Was brauchst du von den Betreuenden, um gut mitarbeiten zu können?",
        type: "longtext",
      },
    ],
  },
  {
    key: "verantwortung",
    title: "Verantwortung übernehmen",
    intro:
      "Ehrliche Selbstreflexion ist ein wichtiger Schritt. Schreibe aus deiner Sicht.",
    fields: [
      {
        key: "situation",
        label: "Beschreibe eine Situation, die dich hierher geführt hat.",
        type: "longtext",
      },
      {
        key: "own_part",
        label: "Welchen Anteil hattest du daran?",
        type: "longtext",
      },
      {
        key: "earlier_stop",
        label: "Was hätte anders laufen können, wenn du früher gebremst hättest?",
        type: "longtext",
      },
    ],
  },
  {
    key: "auswirkungen",
    title: "Auswirkungen auf andere",
    intro: "Dieser Perspektivwechsel fällt oft nicht leicht – versuch es trotzdem.",
    fields: [
      {
        key: "affected",
        label: "Wer war von deinem Verhalten betroffen?",
        type: "longtext",
      },
      {
        key: "their_feelings",
        label: "Wie könnte sich diese Person gefühlt haben?",
        type: "longtext",
      },
      {
        key: "would_say",
        label: "Was würdest du dieser Person heute gern sagen?",
        type: "longtext",
      },
    ],
  },
  {
    key: "ressourcen",
    title: "Meine Stärken & Ressourcen",
    intro: "Veränderung gelingt leichter, wenn du auf deine Stärken baust.",
    fields: [
      {
        key: "goes_well",
        label: "Was gelingt dir in deinem Alltag gut?",
        type: "longtext",
      },
      {
        key: "helpers",
        label: "Wer oder was hilft dir, ruhig zu bleiben?",
        type: "longtext",
      },
      {
        key: "proud_of",
        label: "Worauf bist du bei dir stolz?",
        type: "longtext",
      },
    ],
  },
  {
    key: "strategien",
    title: "Umgang mit schwierigen Situationen",
    intro:
      "Ein Plan für den Ernstfall gibt Sicherheit. Halte konkrete Schritte fest.",
    fields: [
      {
        key: "worked_before",
        label: "Welche Strategie hat dir früher schon einmal geholfen, dich zu beruhigen?",
        type: "longtext",
      },
      {
        key: "three_steps",
        label:
          "Was kannst du konkret tun, wenn du merkst, dass es eng wird? Nenne drei Schritte.",
        type: "longtext",
      },
      {
        key: "confidence",
        label: "Wie sicher fühlst du dich, diese Strategie anzuwenden?",
        type: "scale",
        min: 0,
        max: 10,
        minLabel: "unsicher",
        maxLabel: "sehr sicher",
      },
    ],
  },
  {
    key: "rueckblick",
    title: "Rückblick & Ausblick",
    intro: "Ein guter Moment, um innezuhalten und nach vorn zu schauen.",
    fields: [
      {
        key: "satisfaction",
        label: "Wie zufrieden bist du aktuell mit deinem Fortschritt?",
        type: "scale",
        min: 0,
        max: 10,
        minLabel: "gar nicht",
        maxLabel: "sehr",
      },
      {
        key: "changed",
        label: "Was hat sich seit Beginn des Programms verändert?",
        type: "longtext",
      },
      {
        key: "until_end",
        label: "Woran willst du bis zum Abschluss noch arbeiten?",
        type: "longtext",
      },
    ],
  },
];

export function getWorksheet(key: string): Worksheet | undefined {
  return WORKSHEETS.find((w) => w.key === key);
}

export type WorksheetAnswers = Record<string, string | number>;

/** Zählt, wie viele Felder eines Arbeitsblatts sinnvoll beantwortet wurden. */
export function countAnswered(
  worksheet: Worksheet,
  answers: WorksheetAnswers | null | undefined,
): number {
  if (!answers) return 0;
  return worksheet.fields.filter((f) => {
    const v = answers[f.key];
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    return true; // Zahl (Skala) gilt als beantwortet
  }).length;
}

export function isWorksheetComplete(
  worksheet: Worksheet,
  answers: WorksheetAnswers | null | undefined,
): boolean {
  return countAnswered(worksheet, answers) === worksheet.fields.length;
}
