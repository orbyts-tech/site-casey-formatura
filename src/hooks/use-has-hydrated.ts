"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}
