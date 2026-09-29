"use client";

import { useCallback, useState } from "react";
import { respondToInvitationAction } from "../actions/rsvp-actions";
import type { RsvpStatus } from "../domain/invitation";

export interface RsvpResponse {
  readonly status: RsvpStatus;
  readonly confirmPresence: () => void;
  readonly deferConfirmation: () => void;
}

function recordAnswerInBackground(answer: Exclude<RsvpStatus, "pending">): void {
  respondToInvitationAction(answer).catch((error: unknown) => {
    console.warn("[convite] Não foi possível registrar a resposta agora", error);
  });
}

export function useRsvpResponse(): RsvpResponse {
  const [status, setStatus] = useState<RsvpStatus>("pending");

  const confirmPresence = useCallback(() => {
    setStatus("confirmed");
    recordAnswerInBackground("confirmed");
  }, []);

  const deferConfirmation = useCallback(() => {
    setStatus("deferred");
    recordAnswerInBackground("deferred");
  }, []);

  return { status, confirmPresence, deferConfirmation };
}
