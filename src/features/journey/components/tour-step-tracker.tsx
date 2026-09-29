"use client";

import type { TourStep } from "../domain/tour-progress";
import { useRecordTourStep } from "../hooks/use-tour-progress";

interface TourStepTrackerProps {
  readonly step: TourStep;
}

export function TourStepTracker({ step }: TourStepTrackerProps) {
  useRecordTourStep(step);
  return null;
}
