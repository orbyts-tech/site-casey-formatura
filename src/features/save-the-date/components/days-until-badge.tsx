"use client";

import { CalendarDays } from "lucide-react";
import { formatCountdownLabel } from "../domain/calendar-event";
import { useDaysUntil } from "../hooks/use-days-until";

interface DaysUntilBadgeProps {
  readonly isoDate: string;
}

export function DaysUntilBadge({ isoDate }: DaysUntilBadgeProps) {
  const daysUntilEvent = useDaysUntil(isoDate);

  return (
    <p className="inline-flex min-h-11 min-w-60 items-center justify-center gap-3 rounded-full bg-sage/70 px-7 py-2.5 font-serif text-lg text-forest lg:text-xl">
      <CalendarDays className="size-5 shrink-0" strokeWidth={1.3} />
      {daysUntilEvent === null ? (
        <span className="h-4 w-36 animate-pulse rounded-full bg-sage-deep/60" aria-hidden="true" />
      ) : (
        <span>{formatCountdownLabel(daysUntilEvent)}</span>
      )}
    </p>
  );
}
