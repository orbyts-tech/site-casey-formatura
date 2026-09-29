"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAVIGATION_LINKS, isAdminLinkActive } from "./admin-navigation-links";

export function AdminSidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação do painel">
      <ul className="flex flex-col gap-1">
        {ADMIN_NAVIGATION_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = isAdminLinkActive(href, pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-md px-3.5 py-2.5 font-serif text-[1.02rem] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-soft ${
                  isActive ? "bg-paper/10 text-paper" : "text-paper/65 hover:bg-paper/5 hover:text-paper"
                }`}
              >
                <Icon
                  className={`size-[1.1rem] shrink-0 ${isActive ? "text-gold-soft" : "text-paper/50 group-hover:text-gold-soft"}`}
                  strokeWidth={1.4}
                  aria-hidden="true"
                />
                {label}
                {isActive && <span aria-hidden="true" className="ml-auto h-4 w-px bg-gold-soft" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AdminTabBarNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação do painel"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-soft/60 bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {ADMIN_NAVIGATION_LINKS.map(({ href, shortLabel, icon: Icon }) => {
          const isActive = isAdminLinkActive(href, pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`relative flex flex-col items-center gap-1 px-1 pb-2.5 pt-3 text-[0.68rem] tracking-wide transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-forest ${
                  isActive ? "text-forest" : "text-ink-soft hover:text-forest"
                }`}
              >
                {isActive && <span aria-hidden="true" className="absolute inset-x-6 top-0 h-0.5 rounded-full bg-gold" />}
                <Icon className="size-5" strokeWidth={isActive ? 1.7 : 1.4} aria-hidden="true" />
                {shortLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
