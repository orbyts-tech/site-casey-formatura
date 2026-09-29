"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DATE_SAVED_QUERY, ROUTES } from "@/lib/routes";

const REDIRECT_DELAY_MS = 2_200;
const GIFTS_AFTER_DATE_SAVED_HREF = `${ROUTES.gifts}?${DATE_SAVED_QUERY.key}=${DATE_SAVED_QUERY.value}`;

interface ContinueToGiftsAfterSave {
  readonly isDateSaved: boolean;
  readonly markDateAsSaved: () => void;
}

export function useContinueToGiftsAfterSave(): ContinueToGiftsAfterSave {
  const router = useRouter();
  const [isDateSaved, setIsDateSaved] = useState(false);

  useEffect(() => {
    router.prefetch(GIFTS_AFTER_DATE_SAVED_HREF);
  }, [router]);

  useEffect(() => {
    if (!isDateSaved) return;

    const timeoutId = window.setTimeout(() => router.push(GIFTS_AFTER_DATE_SAVED_HREF), REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isDateSaved, router]);

  const markDateAsSaved = useCallback(() => setIsDateSaved(true), []);

  return { isDateSaved, markDateAsSaved };
}
