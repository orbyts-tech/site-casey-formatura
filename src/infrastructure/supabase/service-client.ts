import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceCredentials, ServerConfigurationError } from "../server-config";

let cachedServiceClient: SupabaseClient | null = null;

// The service role bypasses RLS, so this client must only be used after server-side authorization.
export function getSupabaseServiceClient(): SupabaseClient {
  if (cachedServiceClient) return cachedServiceClient;

  const credentials = getSupabaseServiceCredentials();
  if (!credentials) throw new ServerConfigurationError("Credenciais de serviço do Supabase ausentes.");

  cachedServiceClient = createClient(credentials.url, credentials.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedServiceClient;
}

export function assertNoSupabaseError(error: { message: string } | null, context: string): void {
  if (error) throw new Error(`${context}: ${error.message}`);
}
