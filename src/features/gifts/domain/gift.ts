export interface Gift {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly priceInCents: number;
  readonly imageUrl: string;
  readonly imageAlt: string;
}

export type PriceRangeFilterId = "all" | "upTo100" | "from100To200" | "above200";

interface PriceRangeFilter {
  readonly id: PriceRangeFilterId;
  readonly label: string;
  readonly matches: (priceInCents: number) => boolean;
}

export const PRICE_RANGE_FILTERS: readonly PriceRangeFilter[] = [
  { id: "all", label: "Todos", matches: () => true },
  { id: "upTo100", label: "Até R$ 100", matches: (price) => price <= 10_000 },
  { id: "from100To200", label: "R$ 100 a R$ 200", matches: (price) => price > 10_000 && price <= 20_000 },
  { id: "above200", label: "Acima de R$ 200", matches: (price) => price > 20_000 },
];

export type GiftSortOrder = "featured" | "priceAscending" | "priceDescending";

export const GIFT_SORT_OPTIONS: readonly { id: GiftSortOrder; label: string }[] = [
  { id: "featured", label: "Sugestões da Casey" },
  { id: "priceAscending", label: "Menor valor" },
  { id: "priceDescending", label: "Maior valor" },
];

export function selectVisibleGifts(
  gifts: readonly Gift[],
  priceRangeFilterId: PriceRangeFilterId,
  sortOrder: GiftSortOrder,
): readonly Gift[] {
  const activeFilter = PRICE_RANGE_FILTERS.find((filter) => filter.id === priceRangeFilterId) ?? PRICE_RANGE_FILTERS[0];
  const filteredGifts = gifts.filter((gift) => activeFilter.matches(gift.priceInCents));

  if (sortOrder === "featured") return filteredGifts;

  const direction = sortOrder === "priceAscending" ? 1 : -1;
  return [...filteredGifts].sort((first, second) => (first.priceInCents - second.priceInCents) * direction);
}
