export const GIFT_CONTRIBUTION_STATUSES = ["awaiting_payment", "reported_paid", "confirmed", "cancelled"] as const;
export type GiftContributionStatus = (typeof GIFT_CONTRIBUTION_STATUSES)[number];

export interface GiftContributionItem {
  readonly giftId: string;
  readonly giftName: string;
  readonly quantity: number;
  readonly unitPriceInCents: number;
}

export interface NewGiftContribution {
  readonly id: string;
  readonly giverName: string;
  readonly message: string | null;
  readonly items: readonly GiftContributionItem[];
  readonly totalInCents: number;
  readonly pixTransactionId: string;
  readonly invitationId: string | null;
}

export interface GiftContributionRecord extends NewGiftContribution {
  readonly status: GiftContributionStatus;
  readonly createdAt: string;
  readonly reportedPaidAt: string | null;
  readonly confirmedAt: string | null;
}

export interface GiftContributionRepository {
  create(contribution: NewGiftContribution): Promise<void>;
  markAsReportedPaid(contributionId: string): Promise<void>;
  markAsConfirmed(contributionId: string): Promise<void>;
  listAll(): Promise<readonly GiftContributionRecord[]>;
}

export interface PixReceiver {
  readonly pixKey: string;
  readonly receiverName: string;
  readonly receiverCity: string;
}

export class EmptyGiftCartError extends Error {
  constructor() {
    super("A sacola de presentes está vazia.");
    this.name = "EmptyGiftCartError";
  }
}

export interface ContributionTotals {
  readonly confirmedInCents: number;
  readonly confirmedCount: number;
  readonly reportedInCents: number;
  readonly reportedCount: number;
  readonly awaitingInCents: number;
  readonly awaitingCount: number;
}

export function summarizeContributions(contributions: readonly GiftContributionRecord[]): ContributionTotals {
  const sumByStatus = (status: GiftContributionStatus) =>
    contributions
      .filter((contribution) => contribution.status === status)
      .reduce(
        (totals, contribution) => ({
          inCents: totals.inCents + contribution.totalInCents,
          count: totals.count + 1,
        }),
        { inCents: 0, count: 0 },
      );

  const confirmed = sumByStatus("confirmed");
  const reported = sumByStatus("reported_paid");
  const awaiting = sumByStatus("awaiting_payment");

  return {
    confirmedInCents: confirmed.inCents,
    confirmedCount: confirmed.count,
    reportedInCents: reported.inCents,
    reportedCount: reported.count,
    awaitingInCents: awaiting.inCents,
    awaitingCount: awaiting.count,
  };
}
