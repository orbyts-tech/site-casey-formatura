export const TOUR_STEPS = ["invitationOpened", "saveTheDateVisited", "giftsVisited", "journeyVisited"] as const;

export type TourStep = (typeof TOUR_STEPS)[number];

export function markTourStepVisited(visitedSteps: readonly TourStep[], step: TourStep): readonly TourStep[] {
  if (visitedSteps.includes(step)) return visitedSteps;
  return [...visitedSteps, step];
}

export function hasCompletedFirstTour(visitedSteps: readonly TourStep[]): boolean {
  return TOUR_STEPS.every((step) => visitedSteps.includes(step));
}
