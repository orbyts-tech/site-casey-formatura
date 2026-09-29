import "server-only";
import { z } from "zod";
import { assertNoSupabaseError, getSupabaseServiceClient } from "@/infrastructure/supabase/service-client";
import type { Gift } from "../domain/gift";
import { toPublicGift, type GiftCatalogRepository, type GiftDraft, type GiftRecord } from "../domain/gift-catalog";

const GIFTS_TABLE = "gifts";
const GIFT_COLUMNS = "id, name, description, price_in_cents, image_url, image_alt, is_active, sort_order, created_at";

const giftRowSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    price_in_cents: z.number().int(),
    image_url: z.string(),
    image_alt: z.string(),
    is_active: z.boolean(),
    sort_order: z.number().int(),
    created_at: z.string(),
  })
  .transform(
    (row): GiftRecord => ({
      id: row.id,
      name: row.name,
      description: row.description,
      priceInCents: row.price_in_cents,
      imageUrl: row.image_url,
      imageAlt: row.image_alt,
      isActive: row.is_active,
      sortOrder: row.sort_order,
      createdAt: row.created_at,
    }),
  );

function toGiftRow(draft: GiftDraft) {
  return {
    name: draft.name,
    description: draft.description,
    price_in_cents: draft.priceInCents,
    image_url: draft.imageUrl,
    image_alt: draft.imageAlt,
  };
}

export class SupabaseGiftCatalogRepository implements GiftCatalogRepository {
  private readonly client = getSupabaseServiceClient();

  async listActive(): Promise<readonly Gift[]> {
    const { data, error } = await this.client
      .from(GIFTS_TABLE)
      .select(GIFT_COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    assertNoSupabaseError(error, "Falha ao listar presentes");
    return z.array(giftRowSchema).parse(data ?? []).map(toPublicGift);
  }

  async listAll(): Promise<readonly GiftRecord[]> {
    const { data, error } = await this.client.from(GIFTS_TABLE).select(GIFT_COLUMNS).order("sort_order", { ascending: true });

    assertNoSupabaseError(error, "Falha ao listar presentes");
    return z.array(giftRowSchema).parse(data ?? []);
  }

  async findById(id: string): Promise<GiftRecord | null> {
    const { data, error } = await this.client.from(GIFTS_TABLE).select(GIFT_COLUMNS).eq("id", id).maybeSingle();

    assertNoSupabaseError(error, "Falha ao buscar presente");
    return data ? giftRowSchema.parse(data) : null;
  }

  async create(id: string, draft: GiftDraft): Promise<GiftRecord> {
    const { data: lastGift, error: sortError } = await this.client
      .from(GIFTS_TABLE)
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    assertNoSupabaseError(sortError, "Falha ao calcular ordem do presente");

    const nextSortOrder = z.object({ sort_order: z.number() }).safeParse(lastGift).data?.sort_order ?? 0;

    const { data, error } = await this.client
      .from(GIFTS_TABLE)
      .insert({ id, ...toGiftRow(draft), sort_order: nextSortOrder + 1 })
      .select(GIFT_COLUMNS)
      .single();

    assertNoSupabaseError(error, "Falha ao criar presente");
    return giftRowSchema.parse(data);
  }

  async update(id: string, draft: GiftDraft): Promise<void> {
    const { error } = await this.client.from(GIFTS_TABLE).update(toGiftRow(draft)).eq("id", id);
    assertNoSupabaseError(error, "Falha ao atualizar presente");
  }

  async setActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await this.client.from(GIFTS_TABLE).update({ is_active: isActive }).eq("id", id);
    assertNoSupabaseError(error, "Falha ao atualizar presente");
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.client.from(GIFTS_TABLE).delete().eq("id", id);
    assertNoSupabaseError(error, "Falha ao excluir presente");
  }
}
