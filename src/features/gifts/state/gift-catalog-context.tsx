"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Gift } from "../domain/gift";

const GiftCatalogContext = createContext<readonly Gift[] | null>(null);

interface GiftCatalogProviderProps {
  readonly gifts: readonly Gift[];
  readonly children: ReactNode;
}

export function GiftCatalogProvider({ gifts, children }: GiftCatalogProviderProps) {
  return <GiftCatalogContext value={gifts}>{children}</GiftCatalogContext>;
}

export function useGiftCatalog(): readonly Gift[] {
  const gifts = useContext(GiftCatalogContext);
  if (!gifts) throw new Error("useGiftCatalog precisa estar dentro de GiftCatalogProvider.");
  return gifts;
}
