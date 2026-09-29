import "server-only";
import {
  readDevelopmentCollection,
  updateDevelopmentCollection,
} from "@/infrastructure/development/development-collection-store";
import type {
  GiftContributionRecord,
  GiftContributionRepository,
  NewGiftContribution,
} from "../domain/gift-contribution";

const COLLECTION_NAME = "gift-contributions";

export class DevelopmentGiftContributionRepository implements GiftContributionRepository {
  async create(contribution: NewGiftContribution): Promise<void> {
    const createdContribution: GiftContributionRecord = {
      ...contribution,
      status: "awaiting_payment",
      createdAt: new Date().toISOString(),
      reportedPaidAt: null,
      confirmedAt: null,
    };
    await updateDevelopmentCollection<GiftContributionRecord>(COLLECTION_NAME, (contributions) => [
      createdContribution,
      ...contributions,
    ]);
  }

  async markAsReportedPaid(contributionId: string): Promise<void> {
    await updateDevelopmentCollection<GiftContributionRecord>(COLLECTION_NAME, (contributions) =>
      contributions.map((contribution) =>
        contribution.id === contributionId && contribution.status === "awaiting_payment"
          ? { ...contribution, status: "reported_paid", reportedPaidAt: new Date().toISOString() }
          : contribution,
      ),
    );
  }

  async markAsConfirmed(contributionId: string): Promise<void> {
    await updateDevelopmentCollection<GiftContributionRecord>(COLLECTION_NAME, (contributions) =>
      contributions.map((contribution) =>
        contribution.id === contributionId &&
        (contribution.status === "awaiting_payment" || contribution.status === "reported_paid")
          ? { ...contribution, status: "confirmed", confirmedAt: new Date().toISOString() }
          : contribution,
      ),
    );
  }

  async listAll(): Promise<readonly GiftContributionRecord[]> {
    const contributions = await readDevelopmentCollection<GiftContributionRecord>(COLLECTION_NAME);
    return [...contributions].sort((first, second) => second.createdAt.localeCompare(first.createdAt));
  }
}
