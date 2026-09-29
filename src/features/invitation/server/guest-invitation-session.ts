import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { graduate, graduationEvent } from "@/features/graduation/data/graduation";
import { isProductionEnvironment } from "@/infrastructure/server-config";
import { genericInvitation } from "../data/generic-invitation";
import type { Invitation } from "../domain/invitation";
import { formatGreetingLine, isValidInvitationToken, type InvitationRecord } from "../domain/invitation-record";
import { getInvitationRepository } from "../infrastructure/invitation-repository-factory";

export const GUEST_INVITATION_COOKIE = "casey_convite";
const GUEST_INVITATION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;

export const guestInvitationCookieOptions = {
  httpOnly: true,
  secure: isProductionEnvironment(),
  sameSite: "lax",
  path: "/",
  maxAge: GUEST_INVITATION_COOKIE_MAX_AGE_SECONDS,
} as const;

async function readGuestInvitationToken(): Promise<string | null> {
  const token = (await cookies()).get(GUEST_INVITATION_COOKIE)?.value;
  return token && isValidInvitationToken(token) ? token : null;
}

export const getCurrentInvitationRecord = cache(async (): Promise<InvitationRecord | null> => {
  const token = await readGuestInvitationToken();
  if (!token) return null;

  try {
    return await getInvitationRepository().findByToken(token);
  } catch (error) {
    console.error("[convite] Falha ao carregar convite do convidado", error);
    return null;
  }
});

export function toGuestInvitation(record: InvitationRecord | null): Invitation {
  if (!record) return genericInvitation;

  return {
    id: record.id,
    greetingLine: formatGreetingLine(record.greetingPrefix, record.greetingName),
    guests: record.guestNames.map((fullName, index) => ({ id: `${record.id}-${index}`, fullName })),
    graduate,
    event: graduationEvent,
  };
}

export async function getCurrentGuestInvitation(): Promise<Invitation> {
  return toGuestInvitation(await getCurrentInvitationRecord());
}
