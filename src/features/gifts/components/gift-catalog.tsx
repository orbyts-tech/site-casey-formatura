"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ELEGANT_EASE } from "@/lib/motion";
import { getGiftQuantity } from "../domain/cart";
import {
  GIFT_SORT_OPTIONS,
  PRICE_RANGE_FILTERS,
  selectVisibleGifts,
  type GiftSortOrder,
  type PriceRangeFilterId,
} from "../domain/gift";
import { useGiftCart } from "../hooks/use-gift-cart";
import { useGiftCatalog } from "../state/gift-catalog-context";
import { GiftCard } from "./gift-card";

export function GiftCatalog() {
  const [priceRangeFilterId, setPriceRangeFilterId] = useState<PriceRangeFilterId>("all");
  const [sortOrder, setSortOrder] = useState<GiftSortOrder>("featured");
  const { lines, addGift, setQuantity } = useGiftCart();
  const giftCatalog = useGiftCatalog();

  const visibleGifts = selectVisibleGifts(giftCatalog, priceRangeFilterId, sortOrder);

  return (
    <section aria-label="Lista de presentes" className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filtrar por valor" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {PRICE_RANGE_FILTERS.map((filter) => {
            const isActive = filter.id === priceRangeFilterId;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setPriceRangeFilterId(filter.id)}
                className={`shrink-0 rounded-full border px-4 py-1.5 font-serif text-sm transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                  isActive
                    ? "border-sage-deep bg-sage text-forest"
                    : "border-gold-soft/80 bg-paper/60 text-ink hover:border-gold hover:text-forest"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <label className="relative flex items-center gap-2 self-end font-serif text-sm text-ink sm:self-auto">
          <span className="sr-only">Ordenar presentes</span>
          <select
            value={sortOrder}
            onChange={(changeEvent) => {
              const selectedOption = GIFT_SORT_OPTIONS.find((option) => option.id === changeEvent.target.value);
              if (selectedOption) setSortOrder(selectedOption.id);
            }}
            className="cursor-pointer appearance-none rounded-md bg-transparent py-1.5 pl-2 pr-7 font-serif text-sm text-ink focus-visible:outline-2 focus-visible:outline-forest"
          >
            {GIFT_SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 size-4 text-ink-soft" strokeWidth={1.5} />
        </label>
      </div>

      <motion.ul layout className="mt-6 grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 2xl:gap-6">
        <AnimatePresence mode="popLayout">
          {visibleGifts.map((gift) => (
            <motion.li
              key={gift.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: ELEGANT_EASE }}
            >
              <GiftCard
                gift={gift}
                quantityInCart={getGiftQuantity(lines, gift.id)}
                onAdd={() => addGift(gift.id)}
                onQuantityChange={(nextQuantity) => setQuantity(gift.id, nextQuantity)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {visibleGifts.length === 0 && (
        <p className="mt-10 text-center font-serif text-lg italic text-ink-soft">
          Nenhum presente nessa faixa de valor por enquanto.
        </p>
      )}
    </section>
  );
}
