"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PRESENCE_CONFIRMED_QUERY, ROUTES } from "@/lib/routes";
import type { RsvpStatus } from "../domain/invitation";

const CONFIRMATION_FEEDBACK_DURATION_MS = 1_600;
const SAVE_THE_DATE_AFTER_CONFIRMATION_HREF = `${ROUTES.saveTheDate}?${PRESENCE_CONFIRMED_QUERY.key}=${PRESENCE_CONFIRMED_QUERY.value}`;

export function usePresenceConfirmationRedirect(rsvpStatus: RsvpStatus, shouldPrefetch: boolean): void {
  const router = useRouter();

  useEffect(() => {
    if (!shouldPrefetch) return;
    router.prefetch(SAVE_THE_DATE_AFTER_CONFIRMATION_HREF);
  }, [router, shouldPrefetch]);

  useEffect(() => {
    if (rsvpStatus !== "confirmed") return;

    const timeoutId = window.setTimeout(
      () => router.push(SAVE_THE_DATE_AFTER_CONFIRMATION_HREF),
      CONFIRMATION_FEEDBACK_DURATION_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [router, rsvpStatus]);
}
