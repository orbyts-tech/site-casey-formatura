import Link from "next/link";
import { ArrowUpRight, CalendarDays, Gift, type LucideIcon } from "lucide-react";
import { ROUTES, type AppRoute } from "@/lib/routes";

interface JourneyShortcut {
  readonly title: string;
  readonly linkLabel: string;
  readonly href: AppRoute;
  readonly Icon: LucideIcon;
}

const JOURNEY_SHORTCUTS: readonly JourneyShortcut[] = [
  { title: "Guarde essa data", linkLabel: "Adicionar à agenda", href: ROUTES.saveTheDate, Icon: CalendarDays },
  { title: "Deixe um carinho", linkLabel: "Ver presentes", href: ROUTES.gifts, Icon: Gift },
];

export function JourneyShortcuts() {
  return (
    <nav aria-label="Atalhos" className="mx-auto w-full max-w-3xl border-y border-gold-soft/70">
      <ul className="grid divide-y divide-gold-soft/70 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {JOURNEY_SHORTCUTS.map(({ title, linkLabel, href, Icon }) => (
          <li key={href}>
            <Link href={href} className="group flex items-center justify-center gap-4 px-4 py-5 sm:py-6">
              <Icon aria-hidden="true" className="size-6 shrink-0 text-gold" strokeWidth={1.2} />
              <span>
                <span className="block font-serif text-lg text-forest">{title}</span>
                <span className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors group-hover:text-forest">
                  {linkLabel}
                  <ArrowUpRight
                    className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
