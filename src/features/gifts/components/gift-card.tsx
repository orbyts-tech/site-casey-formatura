import Image from "next/image";
import { Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { MAX_QUANTITY_PER_GIFT } from "../domain/cart";
import type { Gift } from "../domain/gift";
import { formatCentsAsBrl } from "../domain/money";

interface GiftCardProps {
  readonly gift: Gift;
  readonly quantityInCart: number;
  readonly onAdd: () => void;
  readonly onQuantityChange: (nextQuantity: number) => void;
}

export function GiftCard({ gift, quantityInCart, onAdd, onQuantityChange }: GiftCardProps) {
  const isInCart = quantityInCart > 0;

  return (
    <article
      className={`group flex h-full flex-col border bg-paper p-2 shadow-[0_18px_40px_-30px_rgba(21,51,38,0.45)] transition-colors duration-300 sm:p-2.5 ${
        isInCart ? "border-gold" : "border-gold-soft/70 hover:border-gold-soft"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ivory">
        <Image
          src={gift.imageUrl}
          alt={gift.imageAlt}
          fill
          sizes="(min-width: 1536px) 380px, (min-width: 1024px) 30vw, (min-width: 460px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-2 pb-3 pt-4 text-center">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-gold">Presente simbólico</p>
        <h3 className="mt-1.5 font-serif text-lg leading-snug text-forest sm:text-xl">{gift.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-ink-soft sm:text-sm">{gift.description}</p>
        <p className="mt-2 font-serif text-base text-ink sm:text-lg">{formatCentsAsBrl(gift.priceInCents)}</p>

        <div className="mt-auto flex w-full flex-wrap items-center justify-center gap-2 pt-4">
          {isInCart ? (
            <>
              <QuantityStepper
                quantity={quantityInCart}
                maxQuantity={MAX_QUANTITY_PER_GIFT}
                itemLabel={gift.name}
                onQuantityChange={onQuantityChange}
              />
              <span className="inline-flex items-center gap-2 rounded-md bg-sage/70 px-3.5 py-2 font-serif text-sm text-forest">
                <ShoppingBag className="size-4" strokeWidth={1.4} />
                Na sacola
              </span>
            </>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={onAdd}
              trailingIcon={<Plus className="size-3.5" strokeWidth={1.5} />}
              className="min-w-36"
              aria-label={`Adicionar ${gift.name} à sacola`}
            >
              Adicionar
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
