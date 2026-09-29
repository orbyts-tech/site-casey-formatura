"use client";

import { useCallback, useEffect, useState } from "react";

const WELCOME_SEEN_STORAGE_KEY = "casey-formatura:gifts-welcome-seen:v1";
const OPEN_DELAY_MS = 700;

function hasSeenWelcomeThisSession(): boolean {
  try {
    return window.sessionStorage.getItem(WELCOME_SEEN_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberWelcomeSeen(): void {
  try {
    window.sessionStorage.setItem(WELCOME_SEEN_STORAGE_KEY, "true");
  } catch {
    // Private browsing may block storage; the modal simply shows again next visit.
  }
}

export function useGiftsWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (hasSeenWelcomeThisSession()) return;

    const openTimeoutId = window.setTimeout(() => setIsOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(openTimeoutId);
  }, []);

  const closeWelcome = useCallback(() => {
    rememberWelcomeSeen();
    setIsOpen(false);
  }, []);

  return { isOpen, closeWelcome };
}
