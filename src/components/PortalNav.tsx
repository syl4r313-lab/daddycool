import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";

export function PortalNav({
  title,
  subtitle,
  links,
  logoutAction,
  badge,
}: {
  title: string;
  subtitle: string;
  links: { href: string; label: string }[];
  logoutAction: () => void;
  badge?: ReactNode;
}) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" aria-label="Daddy Cool Startseite">
            <Logo iconSize={30} />
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <h1 className="text-lg font-semibold text-stone-900">{title}</h1>
            {badge}
          </div>
          <p className="text-sm text-stone-500">{subtitle}</p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-stone-400 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Abmelden
          </button>
        </form>
      </div>
      <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-brand-50 hover:text-brand-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
