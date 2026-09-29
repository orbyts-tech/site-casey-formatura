import type { Gift } from "./gift";

export interface GiftRecord extends Gift {
  readonly isActive: boolean;
  readonly sortOrder: number;
  readonly createdAt: string;
}

export interface GiftDraft {
  readonly name: string;
  readonly description: string;
  readonly priceInCents: number;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export interface GiftCatalogRepository {
  listActive(): Promise<readonly Gift[]>;
  listAll(): Promise<readonly GiftRecord[]>;
  findById(id: string): Promise<GiftRecord | null>;
  create(id: string, draft: GiftDraft): Promise<GiftRecord>;
  update(id: string, draft: GiftDraft): Promise<void>;
  setActive(id: string, isActive: boolean): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface GiftImageUpload {
  readonly bytes: Uint8Array;
  readonly contentType: GiftImageContentType;
}

export const GIFT_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type GiftImageContentType = (typeof GIFT_IMAGE_CONTENT_TYPES)[number];
export const MAX_GIFT_IMAGE_BYTES = 5 * 1024 * 1024;

export const GIFT_IMAGE_EXTENSIONS: Record<GiftImageContentType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const startsWithBytes = (bytes: Uint8Array, signature: readonly number[], offset = 0): boolean =>
  signature.every((expectedByte, index) => bytes[offset + index] === expectedByte);

export function detectGiftImageContentType(bytes: Uint8Array): GiftImageContentType | null {
  if (startsWithBytes(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWithBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  const isRiffContainer = startsWithBytes(bytes, [0x52, 0x49, 0x46, 0x46]);
  if (isRiffContainer && startsWithBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
  return null;
}

export interface GiftImageStorage {
  upload(image: GiftImageUpload): Promise<string>;
}

export function toPublicGift({ id, name, description, priceInCents, imageUrl, imageAlt }: GiftRecord): Gift {
  return { id, name, description, priceInCents, imageUrl, imageAlt };
}
