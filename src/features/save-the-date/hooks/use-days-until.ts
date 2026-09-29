"use client";

import { useSyncExternalStore } from "react";
import { subscribeToLocalDayChange } from "@/lib/local-day";
import { calculateDaysUntil } from "../domain/calendar-event";

export function useDaysUntil(isoDate: string): number | null {
  return useSyncExternalStore(
    subscribeToLocalDayChange,
    () => calculateDaysUntil(isoDate, new Date()),
    () => null,
  );
}
