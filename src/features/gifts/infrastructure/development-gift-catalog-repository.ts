import "server-only";
import {
  readDevelopmentCollection,
  updateDevelopmentCollection,
} from "@/infrastructure/development/development-collection-store";
import { giftCatalogSeed } from "../data/gift-catalog-seed";
import type { Gift } from "../domain/gift";
import { toPublicGift, type GiftCatalogRepository, type GiftDraft, type GiftRecord } from "../domain/gift-catalog";

const COLLECTION_NAME = "gifts";
const SEED_CREATED_AT = "2026-09-29T00:00:00.000Z";

const seedRecords: readonly GiftRecord[] = giftCatalogSeed.map((gift, index) => ({
  ...gift,
  isActive: true,
  sortOrder: index + 1,
  createdAt: SEED_CREATED_AT,
}));

const bySortOrder = (first: GiftRecord, second: GiftRecord) => first.sortOrder - second.sortOrder;

export class DevelopmentGiftCatalogRepository implements GiftCatalogRepository {
  async listActive(): Promise<readonly Gift[]> {
    const gifts = await this.listAll();
    return gifts.filter((gift) => gift.isActive).map(toPublicGift);
  }

  async listAll(): Promise<readonly GiftRecord[]> {
    const gifts = await readDevelopmentCollection<GiftRecord>(COLLECTION_NAME, seedRecords);
    return [...gifts].sort(bySortOrder);
  }

  async findById(id: string): Promise<GiftRecord | null> {
    const gifts = await readDevelopmentCollection<GiftRecord>(COLLECTION_NAME, seedRecords);
    return gifts.find((gift) => gift.id === id) ?? null;
  }

  async create(id: string, draft: GiftDraft): Promise<GiftRecord> {
    const updatedGifts = await updateDevelopmentCollection<GiftRecord>(
      COLLECTION_NAME,
      (gifts) => {
        const nextSortOrder = gifts.reduce((highest, gift) => Math.max(highest, gift.sortOrder), 0) + 1;
        return [...gifts, { id, ...draft, isActive: true, sortOrder: nextSortOrder, createdAt: new Date().toISOString() }];
      },
      seedRecords,
    );

    const createdGift = updatedGifts.find((gift) => gift.id === id);
    if (!createdGift) throw new Error("Falha ao criar presente");
    return createdGift;
  }

  async update(id: string, draft: GiftDraft): Promise<void> {
    await updateDevelopmentCollection<GiftRecord>(
      COLLECTION_NAME,
      (gifts) => gifts.map((gift) => (gift.id === id ? { ...gift, ...draft } : gift)),
      seedRecords,
    );
  }

  async setActive(id: string, isActive: boolean): Promise<void> {
    await updateDevelopmentCollection<GiftRecord>(
      COLLECTION_NAME,
      (gifts) => gifts.map((gift) => (gift.id === id ? { ...gift, isActive } : gift)),
      seedRecords,
    );
  }

  async delete(id: string): Promise<void> {
    await updateDevelopmentCollection<GiftRecord>(
      COLLECTION_NAME,
      (gifts) => gifts.filter((gift) => gift.id !== id),
      seedRecords,
    );
  }
}
