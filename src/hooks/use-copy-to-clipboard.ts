"use client";

import { useCallback, useEffect, useState } from "react";

type CopyStatus = "idle" | "copied" | "failed";

const STATUS_RESET_DELAY_MS = 2_500;

export function useCopyToClipboard(): { readonly copyStatus: CopyStatus; readonly copyText: (text: string) => Promise<void> } {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (copyStatus === "idle") return;

    const timeoutId = window.setTimeout(() => setCopyStatus("idle"), STATUS_RESET_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [copyStatus]);

  const copyText = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }, []);

  return { copyStatus, copyText };
}
