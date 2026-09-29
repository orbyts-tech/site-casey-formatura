"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ELEGANT_EASE } from "@/lib/motion";
import { ROUTES } from "@/lib/routes";
import { describeCartContents } from "../domain/cart";
import { formatCentsAsBrl } from "../domain/money";
import { useGiftCart } from "../hooks/use-gift-cart";

export function CartSummaryBar() {
  const { pricedCart } = useGiftCart();
  const hasItems = pricedCart.itemCount > 0;
  const headline = pricedCart.itemCount > 1 ? "Carinhos escolhidos" : "Um carinho escolhido";

  return (
    <AnimatePresence>
      {hasItems && (
        <motion.aside
          aria-label="Resumo da sacola"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.5, ease: ELEGANT_EASE }}
          className="sticky bottom-3 z-30 mt-8 w-full rounded-md border border-gold-soft/80 bg-paper/95 p-2 shadow-[0_24px_50px_-24px_rgba(21,51,38,0.5)] backdrop-blur sm:bottom-5"
        >
          <div className="flex flex-col gap-3 rounded-[4px] bg-sage/45 px-4 py-3 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-4">
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <ShoppingBag className="size-6 shrink-0 text-forest" strokeWidth={1.2} />
              <div className="min-w-0">
                <p className="font-serif text-base text-forest sm:text-lg">{headline}</p>
                <p className="truncate text-xs text-ink-soft sm:text-sm">{describeCartContents(pricedCart)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
              <div className="sm:border-l sm:border-gold-soft/70 sm:pl-6 sm:text-right">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">Total</p>
                <p className="font-serif text-xl text-forest sm:text-2xl">{formatCentsAsBrl(pricedCart.totalInCents)}</p>
              </div>
              <ButtonLink
                href={ROUTES.giftsCheckout}
                trailingIcon={<ArrowUpRight className="size-4" strokeWidth={1.5} />}
              >
                <span className="sm:hidden">Pagar</span>
                <span className="hidden sm:inline">Continuar para pagamento</span>
              </ButtonLink>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
