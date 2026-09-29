import { z } from "zod";
import { TOUR_STEPS, markTourStepVisited, type TourStep } from "../domain/tour-progress";

const STORAGE_KEY = "casey-formatura:tour-progress:v1";
const NO_VISITED_STEPS: readonly TourStep[] = [];

const storedProgressSchema = z.array(z.enum(TOUR_STEPS)).max(TOUR_STEPS.length);

const progressListeners = new Set<() => void>();
let cachedVisitedSteps: readonly TourStep[] | null = null;

function readProgressFromStorage(): readonly TourStep[] {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return NO_VISITED_STEPS;

    const parsedProgress = storedProgressSchema.safeParse(JSON.parse(storedValue));
    return parsedProgress.success ? parsedProgress.data : NO_VISITED_STEPS;
  } catch {
    return NO_VISITED_STEPS;
  }
}

function notifyProgressListeners(): void {
  progressListeners.forEach((listener) => listener());
}

function handleStorageEvent(storageEvent: StorageEvent): void {
  if (storageEvent.key !== STORAGE_KEY) return;
  cachedVisitedSteps = readProgressFromStorage();
  notifyProgressListeners();
}

export function subscribeToTourProgress(listener: () => void): () => void {
  if (progressListeners.size === 0) window.addEventListener("storage", handleStorageEvent);
  progressListeners.add(listener);

  return () => {
    progressListeners.delete(listener);
    if (progressListeners.size === 0) window.removeEventListener("storage", handleStorageEvent);
  };
}

export function getTourProgressSnapshot(): readonly TourStep[] {
  cachedVisitedSteps ??= readProgressFromStorage();
  return cachedVisitedSteps;
}

export function recordTourStepVisited(step: TourStep): void {
  const currentSteps = getTourProgressSnapshot();
  const nextSteps = markTourStepVisited(currentSteps, step);
  if (nextSteps === currentSteps) return;

  cachedVisitedSteps = nextSteps;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSteps));
  } catch (error) {
    console.warn("[jornada] Não foi possível salvar o progresso neste navegador", error);
  }
  notifyProgressListeners();
}
