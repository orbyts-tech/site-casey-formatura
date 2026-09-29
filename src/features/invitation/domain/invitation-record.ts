export const GREETING_PREFIXES = ["Querida", "Querido", "Queridas", "Queridos", "Olá"] as const;
export type GreetingPrefix = (typeof GREETING_PREFIXES)[number];

export const INVITATION_RSVP_STATUSES = ["pending", "confirmed", "deferred"] as const;
export type InvitationRsvpStatus = (typeof INVITATION_RSVP_STATUSES)[number];
export type InvitationRsvpAnswer = Exclude<InvitationRsvpStatus, "pending">;

export const MAX_GUESTS_PER_INVITATION = 12;
export const INVITATION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{22}$/;

export interface InvitationRecord {
  readonly id: string;
  readonly token: string;
  readonly greetingPrefix: GreetingPrefix;
  readonly greetingName: string;
  readonly guestNames: readonly string[];
  readonly rsvpStatus: InvitationRsvpStatus;
  readonly respondedAt: string | null;
  readonly openedAt: string | null;
  readonly createdAt: string;
}

export interface NewInvitationRecord {
  readonly id: string;
  readonly token: string;
  readonly greetingPrefix: GreetingPrefix;
  readonly greetingName: string;
  readonly guestNames: readonly string[];
}

export interface InvitationRepository {
  create(invitation: NewInvitationRecord): Promise<InvitationRecord>;
  listAll(): Promise<readonly InvitationRecord[]>;
  findByToken(token: string): Promise<InvitationRecord | null>;
  findById(id: string): Promise<InvitationRecord | null>;
  updateRsvpStatus(id: string, status: InvitationRsvpAnswer, respondedAt: string): Promise<void>;
  markOpened(id: string, openedAt: string): Promise<void>;
  delete(id: string): Promise<void>;
}

export function formatGreetingLine(greetingPrefix: GreetingPrefix, greetingName: string): string {
  return greetingPrefix === "Olá" ? `Olá, ${greetingName}` : `${greetingPrefix} ${greetingName}`;
}

export function isValidInvitationToken(token: string): boolean {
  return INVITATION_TOKEN_PATTERN.test(token);
}

// "Confirmar depois" must never undo a confirmation the guest already gave.
export function resolveNextRsvpStatus(
  currentStatus: InvitationRsvpStatus,
  answer: InvitationRsvpAnswer,
): InvitationRsvpAnswer | null {
  if (currentStatus === answer) return null;
  if (currentStatus === "confirmed" && answer === "deferred") return null;
  return answer;
}

export interface RsvpSummary {
  readonly totalInvitations: number;
  readonly confirmedInvitations: number;
  readonly deferredInvitations: number;
  readonly pendingInvitations: number;
  readonly confirmedGuests: number;
  readonly openedInvitations: number;
}

export function summarizeRsvp(invitations: readonly InvitationRecord[]): RsvpSummary {
  const countByStatus = (status: InvitationRsvpStatus) =>
    invitations.filter((invitation) => invitation.rsvpStatus === status).length;

  return {
    totalInvitations: invitations.length,
    confirmedInvitations: countByStatus("confirmed"),
    deferredInvitations: countByStatus("deferred"),
    pendingInvitations: countByStatus("pending"),
    confirmedGuests: invitations
      .filter((invitation) => invitation.rsvpStatus === "confirmed")
      .reduce((total, invitation) => total + Math.max(invitation.guestNames.length, 1), 0),
    openedInvitations: invitations.filter((invitation) => invitation.openedAt !== null).length,
  };
}
