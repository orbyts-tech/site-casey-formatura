"use client";

import { useMemo, useSyncExternalStore } from "react";
import { addGiftToCart, priceCart, setGiftQuantity, type CartLine, type PricedCart } from "../domain/cart";
import {
  getGiftCartServerSnapshot,
  getGiftCartSnapshot,
  subscribeToGiftCart,
  updateGiftCart,
} from "../state/gift-cart-store";
import { useGiftCatalog } from "../state/gift-catalog-context";

export interface GiftCart {
  readonly lines: readonly CartLine[];
  readonly pricedCart: PricedCart;
  readonly addGift: (giftId: string) => void;
  readonly setQuantity: (giftId: string, quantity: number) => void;
  readonly clearCart: () => void;
}

const cartActions = {
  addGift: (giftId: string) => updateGiftCart((lines) => addGiftToCart(lines, giftId)),
  setQuantity: (giftId: string, quantity: number) =>
    updateGiftCart((lines) => setGiftQuantity(lines, giftId, quantity)),
  clearCart: () => updateGiftCart(() => []),
};

export function useGiftCart(): GiftCart {
  const lines = useSyncExternalStore(subscribeToGiftCart, getGiftCartSnapshot, getGiftCartServerSnapshot);
  const giftCatalog = useGiftCatalog();
  const pricedCart = useMemo(() => priceCart(lines, giftCatalog), [lines, giftCatalog]);

  return { lines, pricedCart, ...cartActions };
}