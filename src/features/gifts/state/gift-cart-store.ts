import { z } from "zod";
import { MAX_DISTINCT_GIFTS_PER_CART, MAX_QUANTITY_PER_GIFT, type CartLine } from "../domain/cart";

const STORAGE_KEY = "casey-formatura:gift-cart:v1";
const EMPTY_CART: readonly CartLine[] = [];

const storedCartSchema = z
  .array(
    z.object({
      giftId: z.string().min(1).max(64),
      quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_GIFT),
    }),
  )
  .max(MAX_DISTINCT_GIFTS_PER_CART);

const cartListeners = new Set<() => void>();
let cachedCartLines: readonly CartLine[] | null = null;

function readCartFromStorage(): readonly CartLine[] {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return EMPTY_CART;

    const parsedCart = storedCartSchema.safeParse(JSON.parse(storedValue));
    return parsedCart.success ? parsedCart.data : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

function notifyCartListeners(): void {
  cartListeners.forEach((listener) => listener());
}

function handleStorageEvent(storageEvent: StorageEvent): void {
  if (storageEvent.key !== STORAGE_KEY) return;
  cachedCartLines = readCartFromStorage();
  notifyCartListeners();
}

export function subscribeToGiftCart(listener: () => void): () => void {
  if (cartListeners.size === 0) window.addEventListener("storage", handleStorageEvent);
  cartListeners.add(listener);

  return () => {
    cartListeners.delete(listener);
    if (cartListeners.size === 0) window.removeEventListener("storage", handleStorageEvent);
  };
}

export function getGiftCartSnapshot(): readonly CartLine[] {
  cachedCartLines ??= readCartFromStorage();
  return cachedCartLines;
}

export function getGiftCartServerSnapshot(): readonly CartLine[] {
  return EMPTY_CART;
}

export function updateGiftCart(updateLines: (currentLines: readonly CartLine[]) => readonly CartLine[]): void {
  cachedCartLines = updateLines(getGiftCartSnapshot());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedCartLines));
  } catch (error) {
    console.warn("[presentes] Não foi possível salvar a sacola neste navegador", error);
  }
  notifyCartListeners();
}
