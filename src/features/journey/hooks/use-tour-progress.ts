"use client";

import { useEffect, useSyncExternalStore } from "react";
import { hasCompletedFirstTour, type TourStep } from "../domain/tour-progress";
import { getTourProgressSnapshot, recordTourStepVisited, subscribeToTourProgress } from "../state/tour-progress-store";

export function useHasCompletedFirstTour(): boolean | null {
  return useSyncExternalStore(
    subscribeToTourProgress,
    () => hasCompletedFirstTour(getTourProgressSnapshot()),
    () => null,
  );
}

export function useRecordTourStep(step: TourStep, shouldRecord = true): void {
  useEffect(() => {
    if (shouldRecord) recordTourStepVisited(step);
  }, [shouldRecord, step]);
}
