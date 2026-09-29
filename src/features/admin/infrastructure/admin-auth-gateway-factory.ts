import "server-only";
import { getDevelopmentAdminCredentials, getSupabaseAuthCredentials } from "@/infrastructure/server-config";
import type { AdminAuthGateway } from "../domain/admin-auth";
import { DevelopmentAdminAuthGateway } from "./development-admin-auth-gateway";
import { SupabaseAdminAuthGateway } from "./supabase-admin-auth-gateway";

export function getAdminAuthGateway(): AdminAuthGateway | null {
  const supabaseCredentials = getSupabaseAuthCredentials();
  if (supabaseCredentials) return new SupabaseAdminAuthGateway(supabaseCredentials);

  const developmentCredentials = getDevelopmentAdminCredentials();
  if (developmentCredentials) return new DevelopmentAdminAuthGateway(developmentCredentials);

  return null;
}
