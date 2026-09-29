"use client";

import { useCallback, useState, useTransition } from "react";
import type { ActionResult } from "@/lib/action-result";

interface AdminMutation<TArguments extends readonly unknown[], TData> {
  readonly isPending: boolean;
  readonly errorMessage: string | null;
  readonly run: (...actionArguments: TArguments) => Promise<ActionResult<TData>>;
  readonly clearError: () => void;
}

export function useAdminMutation<TArguments extends readonly unknown[], TData>(
  action: (...actionArguments: TArguments) => Promise<ActionResult<TData>>,
): AdminMutation<TArguments, TData> {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const run = useCallback(
    (...actionArguments: TArguments) =>
      new Promise<ActionResult<TData>>((resolve) => {
        startTransition(async () => {
          const result = await action(...actionArguments);
          setErrorMessage(result.isSuccess ? null : result.errorMessage);
          resolve(result);
        });
      }),
    [action],
  );

  const clearError = useCallback(() => setErrorMessage(null), []);

  return { isPending, errorMessage, run, clearError };
}
