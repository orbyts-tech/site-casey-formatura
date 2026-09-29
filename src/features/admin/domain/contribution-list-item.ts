import type { GiftContributionRecord } from "@/features/gifts/domain/gift-contribution";
import { formatGreetingLine, type InvitationRecord } from "@/features/invitation/domain/invitation-record";

export interface ContributionListItem extends GiftContributionRecord {
  readonly invitationLabel: string | null;
}

export function toContributionListItems(
  contributions: readonly GiftContributionRecord[],
  invitations: readonly InvitationRecord[],
): readonly ContributionListItem[] {
  const greetingLineByInvitationId = new Map(
    invitations.map((invitation) => [invitation.id, formatGreetingLine(invitation.greetingPrefix, invitation.greetingName)]),
  );

  return contributions.map((contribution) => ({
    ...contribution,
    invitationLabel: contribution.invitationId ? (greetingLineByInvitationId.get(contribution.invitationId) ?? null) : null,
  }));
}

export function countGiftsGiven(contributions: readonly GiftContributionRecord[]): Readonly<Record<string, number>> {
  return contributions
    .filter((contribution) => contribution.status === "confirmed" || contribution.status === "reported_paid")
    .flatMap((contribution) => contribution.items)
    .reduce<Record<string, number>>(
      (quantityByGiftId, item) => ({ ...quantityByGiftId, [item.giftId]: (quantityByGiftId[item.giftId] ?? 0) + item.quantity }),
      {},
    );
}
