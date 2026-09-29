import Link from "next/link";
import { BotanicalSprig } from "@/components/brand/botanical-sprig";
import { ROUTES, type AppRoute } from "@/lib/routes";
import { MobileNavigationMenu } from "./mobile-navigation-menu";
import { NAVIGATION_LINKS } from "./navigation-links";
import { PAGE_CONTAINER_CLASSES } from "./page-container";

interface SiteHeaderProps {
  readonly graduateName: string;
  readonly course: string;
  readonly graduationYear: number;
  readonly activeRoute?: AppRoute;
}

export function SiteHeader({ graduateName, course, graduationYear, activeRoute }: SiteHeaderProps) {
  return (
    <header className={`relative z-10 ${PAGE_CONTAINER_CLASSES}`}>
      <div className="flex items-center justify-between gap-6 border-b border-gold-soft/50 py-4 sm:py-5 lg:py-7 2xl:py-8">
        <Link href={ROUTES.home} className="flex items-center gap-3 sm:gap-4 lg:gap-5 2xl:gap-6">
          <span className="relative flex items-center">
            <BotanicalSprig className="absolute -left-3 top-1 w-6 -rotate-[30deg] sm:-left-4 sm:w-7 lg:-left-5 lg:w-9 2xl:w-11" />
            <span className="relative font-serif text-4xl leading-none text-forest sm:text-5xl lg:text-6xl 2xl:text-7xl">
              {graduateName.charAt(0)}
            </span>
          </span>
          <span className="h-9 w-px bg-gold-soft sm:h-10 lg:h-14 2xl:h-16" />
          <span className="leading-none">
            <span className="block font-serif text-2xl text-forest sm:text-3xl lg:text-4xl 2xl:text-5xl">
              {graduateName}
            </span>
            <span className="mt-1 block text-[0.6rem] uppercase tracking-[0.28em] text-gold sm:text-[0.65rem] lg:mt-2 lg:text-xs lg:tracking-[0.35em] 2xl:text-sm">
              {course} • {graduationYear}
            </span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden md:block">
          <ul className="flex items-center gap-6 whitespace-nowrap lg:gap-10 2xl:gap-12">
            {NAVIGATION_LINKS.map(({ label, href }) => {
              const isActive = href === activeRoute;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`border-b pb-1 font-serif text-base transition-colors duration-300 lg:text-lg 2xl:text-xl ${
                      isActive
                        ? "border-gold text-forest"
                        : "border-transparent text-ink hover:border-gold-soft hover:text-forest"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <MobileNavigationMenu activeRoute={activeRoute} />
      </div>
    </header>
  );
}
