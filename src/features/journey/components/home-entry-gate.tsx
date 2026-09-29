"use client";

import type { ReactNode } from "react";
import { useHasCompletedFirstTour } from "../hooks/use-tour-progress";

interface HomeEntryGateProps {
  readonly firstVisitScreen: ReactNode;
  readonly returningGuestScreen: ReactNode;
}

export function HomeEntryGate({ firstVisitScreen, returningGuestScreen }: HomeEntryGateProps) {
  const hasCompletedFirstTour = useHasCompletedFirstTour();

  if (hasCompletedFirstTour === null) return <div aria-busy="true" className="min-h-svh" />;
  return hasCompletedFirstTour ? returningGuestScreen : firstVisitScreen;
}
