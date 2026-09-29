import { priceCart, type CartLine } from "../domain/cart";
import type { Gift } from "../domain/gift";
import {
  EmptyGiftCartError,
  type GiftContributionRepository,
  type NewGiftContribution,
  type PixReceiver,
} from "../domain/gift-contribution";
import { buildStaticPixPayload } from "../domain/pix-br-code";

export interface CreateGiftContributionRequest {
  readonly giverName: string;
  readonly message: string | null;
  readonly lines: readonly CartLine[];
  readonly invitationId: string | null;
}

export interface CreateGiftContributionDependencies {
  readonly catalog: readonly Gift[];
  readonly repository: GiftContributionRepository;
  readonly pixReceiver: PixReceiver;
  readonly generateId: () => string;
}

export interface CreatedGiftContribution {
  readonly contributionId: string;
  readonly pixPayload: string;
  readonly totalInCents: number;
  readonly receiverName: string;
}

function toPixTransactionId(contributionId: string): string {
  return `CASEY${contributionId.replace(/-/g, "").toUpperCase()}`.slice(0, 25);
}

export async function createGiftContribution(
  request: CreateGiftContributionRequest,
  { catalog, repository, pixReceiver, generateId }: CreateGiftContributionDependencies,
): Promise<CreatedGiftContribution> {
  const pricedCart = priceCart(request.lines, catalog);
  if (pricedCart.lines.length === 0) throw new EmptyGiftCartError();

  const contributionId = generateId();
  const pixTransactionId = toPixTransactionId(contributionId);

  const contribution: NewGiftContribution = {
    id: contributionId,
    giverName: request.giverName,
    message: request.message,
    items: pricedCart.lines.map(({ gift, quantity }) => ({
      giftId: gift.id,
      giftName: gift.name,
      quantity,
      unitPriceInCents: gift.priceInCents,
    })),
    totalInCents: pricedCart.totalInCents,
    pixTransactionId,
    invitationId: request.invitationId,
  };

  const pixPayload = buildStaticPixPayload({
    ...pixReceiver,
    amountInCents: pricedCart.totalInCents,
    transactionId: pixTransactionId,
    description: "Presente formatura Casey",
  });

  await repository.create(contribution);

  return {
    contributionId,
    pixPayload,
    totalInCents: pricedCart.totalInCents,
    receiverName: pixReceiver.receiverName,
  };
}
