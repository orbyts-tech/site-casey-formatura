"use client";

import { useCallback, useEffect, useState } from "react";
import type { InvitationPhase } from "../domain/invitation";

export const RSVP_ACTIONS_DELAY_MS = 10_000;

interface PhaseTransition {
  readonly nextPhase: InvitationPhase;
  readonly afterMs: number;
}

const AUTOMATIC_TRANSITIONS: Partial<Record<InvitationPhase, PhaseTransition>> = {
  unsealing: { nextPhase: "letterRising", afterMs: 1_250 },
  letterRising: { nextPhase: "revealed", afterMs: 1_300 },
};

export interface InvitationFlow {
  readonly phase: InvitationPhase;
  readonly isSealed: boolean;
  readonly isRevealed: boolean;
  readonly areRsvpActionsVisible: boolean;
  readonly openEnvelope: () => void;
}

export function useInvitationFlow(): InvitationFlow {
  const [phase, setPhase] = useState<InvitationPhase>("sealed");
  const [areRsvpActionsVisible, setAreRsvpActionsVisible] = useState(false);

  const openEnvelope = useCallback(() => {
    setPhase((currentPhase) => (currentPhase === "sealed" ? "unsealing" : currentPhase));
  }, []);

  useEffect(() => {
    const transition = AUTOMATIC_TRANSITIONS[phase];
    if (!transition) return;

    const timeoutId = window.setTimeout(() => setPhase(transition.nextPhase), transition.afterMs);
    return () => window.clearTimeout(timeoutId);
  }, [phase]);

  useEffect(() => {
    if (phase !== "revealed") return;

    const timeoutId = window.setTimeout(() => setAreRsvpActionsVisible(true), RSVP_ACTIONS_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [phase]);

  return {
    phase,
    isSealed: phase === "sealed",
    isRevealed: phase === "revealed",
    areRsvpActionsVisible,
    openEnvelope,
  };
}
