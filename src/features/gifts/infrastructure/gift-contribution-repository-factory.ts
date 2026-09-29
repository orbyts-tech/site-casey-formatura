import "server-only";
import { resolveDataBackend } from "@/infrastructure/data-backend";
import type { GiftContributionRepository } from "../domain/gift-contribution";
import { DevelopmentGiftContributionRepository } from "./development-gift-contribution-repository";
import { SupabaseGiftContributionRepository } from "./supabase-gift-contribution-repository";

export function getGiftContributionRepository(): GiftContributionRepository {
  return resolveDataBackend() === "supabase"
    ? new SupabaseGiftContributionRepository()
    : new DevelopmentGiftContributionRepository();
}
