"use client";

import { useCallback, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useDismissableLayer } from "@/hooks/use-dismissable-layer";
import { ELEGANT_EASE } from "@/lib/motion";
import type { AppRoute } from "@/lib/routes";
import { NAVIGATION_LINKS } from "./navigation-links";

interface MobileNavigationMenuProps {
  readonly activeRoute?: AppRoute;
}

export function MobileNavigationMenu({ activeRoute }: MobileNavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const closeMenu = useCallback(() => setIsOpen(false), []);
  useDismissableLayer(menuContainerRef, isOpen, closeMenu);

  return (
    <div ref={menuContainerRef} className="relative md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
        onClick={() => setIsOpen((isCurrentlyOpen) => !isCurrentlyOpen)}
        className="flex size-11 items-center justify-center rounded-full border border-gold-soft/70 text-forest transition-colors hover:border-gold"
      >
        {isOpen ? <X className="size-5" strokeWidth={1.3} /> : <Menu className="size-5" strokeWidth={1.3} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id={menuId}
            aria-label="Navegação principal"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: ELEGANT_EASE }}
            className="absolute right-0 top-full z-40 mt-3 w-56 origin-top-right rounded-lg bg-paper p-1.5 shadow-[0_18px_40px_-16px_rgba(21,51,38,0.35)] ring-1 ring-gold-soft/50"
          >
            <ul>
              {NAVIGATION_LINKS.map(({ label, href }) => {
                const isActive = href === activeRoute;
                return (
                  <li key={href} className="border-b border-sage last:border-b-0">
                    <Link
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={closeMenu}
                      className={`flex items-center justify-between rounded-md px-3 py-3 font-serif text-base transition-colors hover:bg-ivory ${
                        isActive ? "text-forest" : "text-ink"
                      }`}
                    >
                      {label}
                      {isActive && <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
