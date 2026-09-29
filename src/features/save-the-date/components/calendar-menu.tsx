"use client";

import { useCallback, useId, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDismissableLayer } from "@/hooks/use-dismissable-layer";
import { ELEGANT_EASE } from "@/lib/motion";
import { AppleLogo, GoogleLogo, OutlookLogo } from "./calendar-provider-logos";

interface CalendarMenuProps {
  readonly googleCalendarUrl: string;
  readonly calendarFileUrl: string;
  readonly onCalendarChosen: () => void;
}

interface CalendarOption {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly Logo: ComponentType<{ className?: string }>;
}

export function CalendarMenu({ googleCalendarUrl, calendarFileUrl, onCalendarChosen }: CalendarMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const closeMenu = useCallback(() => setIsOpen(false), []);
  useDismissableLayer(menuContainerRef, isOpen, closeMenu);

  const calendarOptions: readonly CalendarOption[] = [
    { id: "google", label: "Google Agenda", href: googleCalendarUrl, Logo: GoogleLogo },
    { id: "apple", label: "Apple / iPhone · .ics", href: calendarFileUrl, Logo: AppleLogo },
    { id: "outlook", label: "Outlook · .ics", href: calendarFileUrl, Logo: OutlookLogo },
  ];

  const handleCalendarChosen = () => {
    closeMenu();
    onCalendarChosen();
  };

  return (
    <div ref={menuContainerRef} className="relative w-full sm:w-auto">
      <Button
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((isCurrentlyOpen) => !isCurrentlyOpen)}
        leadingIcon={<CalendarDays className="size-5" strokeWidth={1.3} />}
        className="w-full sm:min-w-64"
      >
        Adicionar ao calendário
        <ChevronDown
          className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          strokeWidth={1.5}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.25, ease: ELEGANT_EASE }}
            className="absolute inset-x-0 top-full z-30 mt-2 origin-top text-left overflow-hidden rounded-lg bg-white p-1.5 shadow-[0_18px_40px_-16px_rgba(21,51,38,0.35)] ring-1 ring-gold-soft/40"
          >
            {calendarOptions.map(({ id, label, href, Logo }) => (
              <li key={id} role="none" className="border-b border-sage last:border-b-0">
                <a
                  role="menuitem"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleCalendarChosen}
                  className="flex items-center gap-3 rounded-md px-3 py-3 font-serif text-base text-ink transition-colors hover:bg-ivory focus-visible:bg-ivory focus-visible:outline-none"
                >
                  <Logo className="size-5 shrink-0" />
                  <span className="flex-1">{label}</span>
                  <ChevronRight className="size-4 text-ink-soft" strokeWidth={1.5} />
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
