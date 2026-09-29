const brazilianRealFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const MAX_GIFT_PRICE_IN_CENTS = 10_000_000;

export function formatCentsAsBrl(amountInCents: number): string {
  return brazilianRealFormatter.format(amountInCents / 100);
}

export function formatCentsAsDecimalInput(amountInCents: number): string {
  return (amountInCents / 100).toFixed(2).replace(".", ",");
}

// Accepts "80", "80,5", "80,50", "1.234,56" and "R$ 1.234,56".
export function parseBrlToCents(rawAmount: string): number | null {
  const normalizedAmount = rawAmount.replace(/R\$\s?/i, "").replace(/\s/g, "").trim();
  if (!/^\d{1,3}(\.?\d{3})*(,\d{1,2})?$/.test(normalizedAmount)) return null;

  const [integerPart, decimalPart = ""] = normalizedAmount.replace(/\./g, "").split(",");
  return Number(integerPart) * 100 + Number(decimalPart.padEnd(2, "0"));
}
