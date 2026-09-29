import "server-only";
import { getSupabaseServiceCredentials, isProductionEnvironment, ServerConfigurationError } from "./server-config";

export type DataBackend = "supabase" | "developmentFile";

export function resolveDataBackend(): DataBackend {
  if (getSupabaseServiceCredentials()) return "supabase";
  if (!isProductionEnvironment()) return "developmentFile";

  throw new ServerConfigurationError("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias em produção.");
}
