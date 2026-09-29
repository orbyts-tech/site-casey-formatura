import {
  resolveNextRsvpStatus,
  type InvitationRecord,
  type InvitationRepository,
  type InvitationRsvpAnswer,
} from "../domain/invitation-record";

export async function respondToInvitation(
  invitation: InvitationRecord,
  answer: InvitationRsvpAnswer,
  repository: InvitationRepository,
  now: Date = new Date(),
): Promise<void> {
  const nextStatus = resolveNextRsvpStatus(invitation.rsvpStatus, answer);
  if (!nextStatus) return;

  await repository.updateRsvpStatus(invitation.id, nextStatus, now.toISOString());
}
