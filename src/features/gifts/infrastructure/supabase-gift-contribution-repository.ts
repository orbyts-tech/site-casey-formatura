import "server-only";
import { z } from "zod";
import { assertNoSupabaseError, getSupabaseServiceClient } from "@/infrastructure/supabase/service-client";
import {
  GIFT_CONTRIBUTION_STATUSES,
  type GiftContributionRecord,
  type GiftContributionRepository,
  type NewGiftContribution,
} from "../domain/gift-contribution";

const GIFT_CONTRIBUTIONS_TABLE = "gift_contributions";
const CONTRIBUTION_COLUMNS =
  "id, giver_name, message, items, total_in_cents, pix_txid, invitation_id, status, created_at, reported_paid_at, confirmed_at";

const contributionRowSchema = z
  .object({
    id: z.string(),
    giver_name: z.string(),
    message: z.string().nullable(),
    items: z.array(
      z.object({
        gift_id: z.string(),
        gift_name: z.string(),
        quantity: z.number().int(),
        unit_price_in_cents: z.number().int(),
      }),
    ),
    total_in_cents: z.number().int(),
    pix_txid: z.string(),
    invitation_id: z.string().nullable(),
    status: z.enum(GIFT_CONTRIBUTION_STATUSES),
    created_at: z.string(),
    reported_paid_at: z.string().nullable(),
    confirmed_at: z.string().nullable(),
  })
  .transform(
    (row): GiftContributionRecord => ({
      id: row.id,
      giverName: row.giver_name,
      message: row.message,
      items: row.items.map((item) => ({
        giftId: item.gift_id,
        giftName: item.gift_name,
        quantity: item.quantity,
        unitPriceInCents: item.unit_price_in_cents,
      })),
      totalInCents: row.total_in_cents,
      pixTransactionId: row.pix_txid,
      invitationId: row.invitation_id,
      status: row.status,
      createdAt: row.created_at,
      reportedPaidAt: row.reported_paid_at,
      confirmedAt: row.confirmed_at,
    }),
  );

export class SupabaseGiftContributionRepository implements GiftContributionRepository {
  private readonly client = getSupabaseServiceClient();

  async create(contribution: NewGiftContribution): Promise<void> {
    const { error } = await this.client.from(GIFT_CONTRIBUTIONS_TABLE).insert({
      id: contribution.id,
      giver_name: contribution.giverName,
      message: contribution.message,
      items: contribution.items.map((item) => ({
        gift_id: item.giftId,
        gift_name: item.giftName,
        quantity: item.quantity,
        unit_price_in_cents: item.unitPriceInCents,
      })),
      total_in_cents: contribution.totalInCents,
      pix_txid: contribution.pixTransactionId,
      invitation_id: contribution.invitationId,
    });

    assertNoSupabaseError(error, "Falha ao registrar presente");
  }

  async markAsReportedPaid(contributionId: string): Promise<void> {
    const { error } = await this.client
      .from(GIFT_CONTRIBUTIONS_TABLE)
      .update({ status: "reported_paid", reported_paid_at: new Date().toISOString() })
      .eq("id", contributionId)
      .eq("status", "awaiting_payment");

    assertNoSupabaseError(error, "Falha ao atualizar presente");
  }

  async markAsConfirmed(contributionId: string): Promise<void> {
    const { error } = await this.client
      .from(GIFT_CONTRIBUTIONS_TABLE)
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("id", contributionId)
      .in("status", ["awaiting_payment", "reported_paid"]);

    assertNoSupabaseError(error, "Falha ao confirmar presente");
  }

  async listAll(): Promise<readonly GiftContributionRecord[]> {
    const { data, error } = await this.client
      .from(GIFT_CONTRIBUTIONS_TABLE)
      .select(CONTRIBUTION_COLUMNS)
      .order("created_at", { ascending: false });

    assertNoSupabaseError(error, "Falha ao listar presentes recebidos");
    return z.array(contributionRowSchema).parse(data ?? []);
  }
}
