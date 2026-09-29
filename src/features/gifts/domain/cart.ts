import type { Gift } from "./gift";

export const MAX_QUANTITY_PER_GIFT = 10;
export const MAX_DISTINCT_GIFTS_PER_CART = 30;

export interface CartLine {
  readonly giftId: string;
  readonly quantity: number;
}

export interface PricedCartLine {
  readonly gift: Gift;
  readonly quantity: number;
  readonly subtotalInCents: number;
}

export interface PricedCart {
  readonly lines: readonly PricedCartLine[];
  readonly totalInCents: number;
  readonly itemCount: number;
}

function clampQuantity(quantity: number): number {
  return Math.min(Math.max(Math.trunc(quantity), 0), MAX_QUANTITY_PER_GIFT);
}

export function setGiftQuantity(lines: readonly CartLine[], giftId: string, quantity: number): readonly CartLine[] {
  const nextQuantity = clampQuantity(quantity);
  const hasGift = lines.some((line) => line.giftId === giftId);

  if (nextQuantity === 0) return lines.filter((line) => line.giftId !== giftId);
  if (!hasGift) return [...lines, { giftId, quantity: nextQuantity }];

  return lines.map((line) => (line.giftId === giftId ? { ...line, quantity: nextQuantity } : line));
}

export function addGiftToCart(lines: readonly CartLine[], giftId: string): readonly CartLine[] {
  const currentQuantity = lines.find((line) => line.giftId === giftId)?.quantity ?? 0;
  return setGiftQuantity(lines, giftId, currentQuantity + 1);
}

export function getGiftQuantity(lines: readonly CartLine[], giftId: string): number {
  return lines.find((line) => line.giftId === giftId)?.quantity ?? 0;
}

export function priceCart(lines: readonly CartLine[], catalog: readonly Gift[]): PricedCart {
  const pricedLines = lines.flatMap((line): PricedCartLine[] => {
    const gift = catalog.find((catalogGift) => catalogGift.id === line.giftId);
    const quantity = clampQuantity(line.quantity);
    if (!gift || quantity === 0) return [];

    return [{ gift, quantity, subtotalInCents: gift.priceInCents * quantity }];
  });

  return {
    lines: pricedLines,
    totalInCents: pricedLines.reduce((total, line) => total + line.subtotalInCents, 0),
    itemCount: pricedLines.reduce((count, line) => count + line.quantity, 0),
  };
}

export function describeCartContents(pricedCart: PricedCart): string {
  const giftNames = pricedCart.lines.map((line) => line.gift.name);
  const countLabel = pricedCart.itemCount === 1 ? "1 presente" : `${pricedCart.itemCount} presentes`;
  const namesLabel = giftNames.length > 2 ? `${giftNames.slice(0, 2).join(", ")} e mais` : giftNames.join(" e ");

  return `${namesLabel} · ${countLabel}`;
}
