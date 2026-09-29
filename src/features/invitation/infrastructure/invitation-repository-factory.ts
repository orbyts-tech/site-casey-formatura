import "server-only";
import { resolveDataBackend } from "@/infrastructure/data-backend";
import type { InvitationRepository } from "../domain/invitation-record";
import { DevelopmentInvitationRepository } from "./development-invitation-repository";
import { SupabaseInvitationRepository } from "./supabase-invitation-repository";

export function getInvitationRepository(): InvitationRepository {
  return resolveDataBackend() === "supabase" ? new SupabaseInvitationRepository() : new DevelopmentInvitationRepository();
}
