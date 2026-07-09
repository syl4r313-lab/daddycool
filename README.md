# Daddy Cool – Programmbegleitung

Web-App zur Begleitung des Täterarbeit-Programms **Daddy Cool**. Teilnehmende
werden ausschließlich über eine zugeteilte Frucht angezeigt – nirgends im
Teilnehmenden-Bereich taucht ein Klarname auf.

## Funktionen

- **Anonymisierung**: Jede/r Teilnehmende erhält automatisch eine Frucht
  (🍎 Apfel, 🍐 Birne, …) als Anzeigenamen. Der optionale Klarname ist nur in
  der internen Verwaltungsansicht für Betreuende sichtbar.
- **Kalender**: Betreuende legen Termine an (Erstgespräch, 8 Sitzungen,
  Abschlussgespräch) und erfassen die Anwesenheit. Teilnehmende sehen ihre
  kommenden und vergangenen Termine sowie ihren eigenen Anwesenheitsstatus.
- **Erinnerung**: Das Dashboard der Teilnehmenden zeigt den nächsten Termin
  mit Countdown ("in 3 Tagen") prominent an.
- **Anonymer Kontakt**: Teilnehmende können den Betreuenden Nachrichten
  schreiben – sichtbar ist dabei nur die Frucht, nie der Name.
- **Material**: Betreuende stellen Texte und Links zum Nachlesen bereit.
- **Fortschritt**: Teilnehmende sehen jederzeit, wie viele der insgesamt 10
  Termine (1 Erstgespräch + 8 Sitzungen + 1 Abschlussgespräch) sie bereits
  absolviert haben und ob das Zertifikat erreicht ist.

## Zugänge

Es gibt zwei getrennte Bereiche mit eigenem Login:

- **Team-Bereich** (`/anmelden/team`): E-Mail + Passwort für Betreuende.
- **Programm-Bereich** (`/anmelden/programm`): Ein persönlicher, numerischer
  Zugangscode für Teilnehmende – bewusst ohne Name oder E-Mail-Adresse, damit
  die Anmeldung anonym bleibt. Der Code wird beim Anlegen einer Teilnahme im
  Team-Bereich automatisch erzeugt und einmalig angezeigt.

## Tech-Stack

- [Next.js](https://nextjs.org) (App Router) mit TypeScript
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io) mit SQLite (Datei-Datenbank, kein externer
  Server nötig)
- Sitzungscookies (signiert mit `jose`), Passwort-/Code-Hashing mit `bcryptjs`

## Erste Schritte

```bash
npm install
cp .env.example .env   # SESSION_SECRET durch einen eigenen Wert ersetzen
npm run db:migrate     # Datenbank anlegen
npm run db:seed        # Team-Zugang + Demo-Daten anlegen
npm run dev
```

Die Konsolenausgabe von `npm run db:seed` zeigt den erzeugten Team-Login
sowie (beim ersten Lauf) drei Demo-Zugangscodes für Teilnehmende.
Standard-Zugangsdaten für das Team lassen sich über die Umgebungsvariablen
`SEED_STAFF_EMAIL` und `SEED_STAFF_PASSWORD` überschreiben.

Öffne anschließend [http://localhost:3000](http://localhost:3000).

## Datenmodell (Kurzüberblick)

- `Staff` – Betreuende (E-Mail-Login)
- `Participant` – Teilnehmende, identifiziert über `fruitName`/`fruitEmoji`;
  `realName`/`notes` sind optional und nur intern sichtbar
- `ProgramSession` – Termine (`INTERVIEW`, `SITZUNG` 1–8, `ABSCHLUSS`)
- `Attendance` – Anwesenheitsstatus je Teilnehmer:in und Termin
- `Message` – Nachrichten zwischen Teilnehmenden und Betreuenden
- `Material` – Texte/Links zum Nachlesen

## Hinweise

- Erinnerungen erfolgen aktuell **nur in der App** (Dashboard-Banner), nicht
  per E-Mail/SMS – dadurch müssen keine Kontaktdaten der Teilnehmenden
  gespeichert werden.
- Die App ist für eine einzelne laufende Gruppe ausgelegt (kein
  Mehrgruppen-/Kohortenbetrieb).
- Vor dem Einsatz mit echten Daten: `SESSION_SECRET` auf einen langen,
  zufälligen Wert setzen (`openssl rand -base64 32`) und die Datenbank auf
  ein produktionstaugliches Backup-Verfahren umstellen.
