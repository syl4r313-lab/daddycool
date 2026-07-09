import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center">
      <Logo iconSize={56} className="gap-3" wordmarkClassName="text-3xl sm:text-4xl" />

      <h1 className="mt-8 text-3xl font-bold text-stone-900 sm:text-4xl">
        Programmbegleitung für die Täterarbeit
      </h1>
      <p className="mt-4 max-w-xl text-base text-stone-600">
        Kalender, anonymer Kontakt zu Betreuenden, Materialien zum Nachlesen
        und der eigene Fortschritt im Programm – alles an einem Ort.
        Teilnehmende werden ausschließlich über eine zugeteilte Frucht
        angezeigt, niemals über ihren Klarnamen.
      </p>

      <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
        <Link
          href="/anmelden/programm"
          className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm transition hover:border-brand-400 hover:shadow-md"
        >
          <div className="text-3xl">🍎</div>
          <h2 className="mt-3 text-lg font-semibold text-stone-900">
            Ich nehme am Programm teil
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Anmeldung mit deinem persönlichen Zugangscode.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-brand-700">
            Zum Zugang →
          </span>
        </Link>

        <Link
          href="/anmelden/team"
          className="rounded-2xl border border-stone-200 bg-white p-6 text-left shadow-sm transition hover:border-brand-400 hover:shadow-md"
        >
          <div className="text-3xl">🗂️</div>
          <h2 className="mt-3 text-lg font-semibold text-stone-900">
            Ich bin Betreuer/in
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Anmeldung mit E-Mail und Passwort für das Team.
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-brand-700">
            Zum Team-Login →
          </span>
        </Link>
      </div>
    </main>
  );
}
