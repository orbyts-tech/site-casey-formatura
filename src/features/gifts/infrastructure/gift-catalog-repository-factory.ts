import "server-only";
import { resolveDataBackend } from "@/infrastructure/data-backend";
import type { GiftCatalogRepository } from "../domain/gift-catalog";
import { DevelopmentGiftCatalogRepository } from "./development-gift-catalog-repository";
import { SupabaseGiftCatalogRepository } from "./supabase-gift-catalog-repository";

export function getGiftCatalogRepository(): GiftCatalogRepository {
  return resolveDataBackend() === "supabase" ? new SupabaseGiftCatalogRepository() : new DevelopmentGiftCatalogRepository();
}
