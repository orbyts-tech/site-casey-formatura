"use client";

import { CalendarHeart } from "lucide-react";
import { formatCountdownLabel } from "@/features/save-the-date/domain/calendar-event";
import { useDaysUntil } from "@/features/save-the-date/hooks/use-days-until";

interface CelebrationDateBarProps {
  readonly eventIsoDate: string;
  readonly eventDateLabel: string;
}

export function CelebrationDateBar({ eventIsoDate, eventDateLabel }: CelebrationDateBarProps) {
  const daysUntilEvent = useDaysUntil(eventIsoDate);

  return (
    <section
      aria-label="Data da celebração"
      className="grid gap-3 rounded-md bg-sage/60 px-5 py-5 text-center sm:grid-cols-[1fr_auto_1.4fr_auto_1fr] sm:items-center sm:gap-6 sm:px-8 sm:py-6 lg:px-12"
    >
      <p className="flex items-center justify-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-ink-soft sm:justify-start sm:text-xs">
        <CalendarHeart className="size-6 shrink-0 text-gold" strokeWidth={1.2} />
        Nosso encontro
      </p>
      <span aria-hidden="true" className="hidden h-10 w-px bg-gold-soft sm:block" />
      <p className="font-serif text-2xl text-forest sm:text-3xl 2xl:text-4xl">{eventDateLabel}</p>
      <span aria-hidden="true" className="hidden h-10 w-px bg-gold-soft sm:block" />
      <p
        aria-live="polite"
        className={`font-serif text-lg text-forest transition-opacity duration-500 sm:text-right sm:text-xl ${
          daysUntilEvent === null ? "opacity-0" : "opacity-100"
        }`}
      >
        {daysUntilEvent === null ? "Contando os dias" : formatCountdownLabel(daysUntilEvent)}
      </p>
    </section>
  );
}
