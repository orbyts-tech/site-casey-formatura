"use client";

import Image from "next/image";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { MAX_QUANTITY_PER_GIFT, type PricedCart } from "../../domain/cart";
import { formatCentsAsBrl } from "../../domain/money";

interface CheckoutOrderSummaryProps {
  readonly pricedCart: PricedCart;
  readonly isEditable: boolean;
  readonly onQuantityChange: (giftId: string, nextQuantity: number) => void;
}

export function CheckoutOrderSummary({ pricedCart, isEditable, onQuantityChange }: CheckoutOrderSummaryProps) {
  return (
    <section aria-labelledby="order-summary-title" className="bg-paper p-2 shadow-[0_24px_50px_-30px_rgba(21,51,38,0.45)]">
      <div className="border border-gold-soft/70 px-4 py-5 sm:px-5">
        <h2 id="order-summary-title" className="font-serif text-xl text-forest">
          Sua sacola
        </h2>

        <ul className="mt-4 divide-y divide-gold-soft/50">
          {pricedCart.lines.map(({ gift, quantity, subtotalInCents }) => (
            <li key={gift.id} className="flex gap-3 py-3">
              <div className="relative size-16 shrink-0 overflow-hidden bg-ivory">
                <Image src={gift.imageUrl} alt={gift.imageAlt} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-serif text-base leading-snug text-forest">{gift.name}</p>
                  <p className="shrink-0 font-serif text-base text-ink">{formatCentsAsBrl(subtotalInCents)}</p>
                </div>
                {isEditable ? (
                  <QuantityStepper
                    quantity={quantity}
                    maxQuantity={MAX_QUANTITY_PER_GIFT}
                    itemLabel={gift.name}
                    onQuantityChange={(nextQuantity) => onQuantityChange(gift.id, nextQuantity)}
                  />
                ) : (
                  <p className="text-sm text-ink-soft">
                    {quantity} × {formatCentsAsBrl(gift.priceInCents)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-baseline justify-between border-t border-gold-soft/70 pt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Total</p>
          <p className="font-serif text-2xl text-forest">{formatCentsAsBrl(pricedCart.totalInCents)}</p>
        </div>
      </div>
    </section>
  );
}
