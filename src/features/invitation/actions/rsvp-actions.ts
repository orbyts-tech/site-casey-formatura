"use server";

import { z } from "zod";
import { getClientIp } from "@/infrastructure/security/client-ip";
import { isWithinRateLimit, RATE_LIMIT_POLICIES } from "@/infrastructure/security/rate-limiter";
import { respondToInvitation } from "../application/respond-to-invitation";
import { getInvitationRepository } from "../infrastructure/invitation-repository-factory";
import { getCurrentInvitationRecord } from "../server/guest-invitation-session";

const rsvpAnswerSchema = z.enum(["confirmed", "deferred"]);

export async function respondToInvitationAction(answer: unknown): Promise<{ readonly isRecorded: boolean }> {
  const parsedAnswer = rsvpAnswerSchema.safeParse(answer);
  if (!parsedAnswer.success) return { isRecorded: false };

  const invitation = await getCurrentInvitationRecord();
  if (!invitation) return { isRecorded: false };
  if (!(await isWithinRateLimit(RATE_LIMIT_POLICIES.rsvpAnswer, await getClientIp()))) return { isRecorded: false };

  try {
    await respondToInvitation(invitation, parsedAnswer.data, getInvitationRepository());
    return { isRecorded: true };
  } catch (error) {
    console.error("[convite] Falha ao registrar resposta", error);
    return { isRecorded: false };
  }
}
