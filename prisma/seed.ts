import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { FRUITS } from "../src/lib/fruits";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL ist nicht gesetzt.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const STAFF_EMAIL = process.env.SEED_STAFF_EMAIL ?? "team@daddycool.example";
const STAFF_PASSWORD = process.env.SEED_STAFF_PASSWORD ?? "daddycool-demo";

async function main() {
  const passwordHash = await bcrypt.hash(STAFF_PASSWORD, 10);
  await prisma.staff.upsert({
    where: { email: STAFF_EMAIL },
    update: {},
    create: {
      name: "Team-Zugang",
      email: STAFF_EMAIL,
      passwordHash,
      role: "ADMIN",
    },
  });

  const existingParticipants = await prisma.participant.count();
  if (existingParticipants === 0) {
    const demoCodes: { fruit: (typeof FRUITS)[number]; code: string }[] = [
      { fruit: FRUITS[0], code: "111111" },
      { fruit: FRUITS[1], code: "222222" },
      { fruit: FRUITS[2], code: "333333" },
    ];

    for (const { fruit, code } of demoCodes) {
      await prisma.participant.create({
        data: {
          fruitName: fruit.name,
          fruitEmoji: fruit.emoji,
          codeHash: await bcrypt.hash(code, 10),
        },
      });
    }

    const participants = await prisma.participant.findMany();
    const now = Date.now();
    const day = 1000 * 60 * 60 * 24;

    const interview = await prisma.programSession.create({
      data: {
        type: "INTERVIEW",
        title: "Erstgespräch",
        date: new Date(now - 30 * day),
      },
    });
    const sitzung1 = await prisma.programSession.create({
      data: {
        type: "SITZUNG",
        sitzungNummer: 1,
        title: "Gruppensitzung 1",
        date: new Date(now - 14 * day),
      },
    });
    const sitzung2 = await prisma.programSession.create({
      data: {
        type: "SITZUNG",
        sitzungNummer: 2,
        title: "Gruppensitzung 2",
        date: new Date(now + 3 * day),
        location: "Beratungsstelle, Raum 2",
      },
    });

    for (const p of participants) {
      await prisma.attendance.create({
        data: { participantId: p.id, sessionId: interview.id, status: "ANWESEND" },
      });
      await prisma.attendance.create({
        data: { participantId: p.id, sessionId: sitzung1.id, status: "ANWESEND" },
      });
      await prisma.attendance.create({
        data: { participantId: p.id, sessionId: sitzung2.id, status: "OFFEN" },
      });
    }

    await prisma.material.create({
      data: {
        title: "Willkommen bei Daddy Cool",
        description: "Kurzer Überblick über Ablauf und Ziele des Programms.",
        category: "Einstieg",
        content:
          "Daddy Cool begleitet Väter dabei, Verantwortung für ihr Verhalten zu übernehmen und gewaltfreie Wege im Familienalltag zu finden. Das Programm umfasst ein Erstgespräch, 8 Gruppensitzungen und ein Abschlussgespräch.",
      },
    });
  }

  console.log("Seed abgeschlossen.");
  console.log(`Team-Login: ${STAFF_EMAIL} / ${STAFF_PASSWORD}`);
  if (existingParticipants === 0) {
    console.log("Demo-Zugangscodes für Teilnehmende: 111111, 222222, 333333");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
