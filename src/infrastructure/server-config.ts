import "server-only";
import { z } from "zod";

const supabaseServiceEnvSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

const supabaseAuthEnvSchema = z.object({
  SUPABASE_URL: z.url(),
  SUPABASE_ANON_KEY: z.string().min(1),
});

const developmentAdminEnvSchema = z.object({
  DEV_ADMIN_PASSWORD: z.string().min(8),
  DEV_ADMIN_SESSION_SECRET: z.string().min(32),
});

export interface SupabaseServiceCredentials {
  readonly url: string;
  readonly serviceRoleKey: string;
}

export interface SupabaseAuthCredentials {
  readonly url: string;
  readonly anonKey: string;
}

export interface DevelopmentAdminCredentials {
  readonly password: string;
  readonly sessionSecret: string;
}

export class ServerConfigurationError extends Error {
  constructor(detail: string) {
    super(`Configuração do servidor inválida: ${detail}`);
    this.name = "ServerConfigurationError";
  }
}

export const isProductionEnvironment = (): boolean => process.env.NODE_ENV === "production";

export function getSupabaseServiceCredentials(): SupabaseServiceCredentials | null {
  const parsedEnv = supabaseServiceEnvSchema.safeParse(process.env);
  if (!parsedEnv.success) return null;
  return { url: parsedEnv.data.SUPABASE_URL, serviceRoleKey: parsedEnv.data.SUPABASE_SERVICE_ROLE_KEY };
}

export function getSupabaseAuthCredentials(): SupabaseAuthCredentials | null {
  const parsedEnv = supabaseAuthEnvSchema.safeParse(process.env);
  if (!parsedEnv.success) return null;
  return { url: parsedEnv.data.SUPABASE_URL, anonKey: parsedEnv.data.SUPABASE_ANON_KEY };
}

export function getDevelopmentAdminCredentials(): DevelopmentAdminCredentials | null {
  if (isProductionEnvironment()) return null;
  const parsedEnv = developmentAdminEnvSchema.safeParse(process.env);
  if (!parsedEnv.success) return null;
  return { password: parsedEnv.data.DEV_ADMIN_PASSWORD, sessionSecret: parsedEnv.data.DEV_ADMIN_SESSION_SECRET };
}

export function getAllowedAdminEmails(): ReadonlySet<string> {
  const rawEmails = process.env.ADMIN_EMAILS ?? "";
  return new Set(
    rawEmails
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter((email) => email.length > 0),
  );
}

export function isAllowedAdminEmail(email: string): boolean {
  return getAllowedAdminEmails().has(email.trim().toLowerCase());
}

const LOCAL_DEVELOPMENT_RATE_LIMIT_SECRET = "casey-local-development-rate-limit";

export function getRateLimitSecret(): string {
  const configuredSecret =
    process.env.RATE_LIMIT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.DEV_ADMIN_SESSION_SECRET;
  if (configuredSecret) return configuredSecret;
  if (isProductionEnvironment()) throw new ServerConfigurationError("RATE_LIMIT_SECRET não configurado.");
  return LOCAL_DEVELOPMENT_RATE_LIMIT_SECRET;
}

export function getConfiguredSiteUrl(): string | null {
  const parsedUrl = z.url().safeParse(process.env.SITE_URL);
  return parsedUrl.success ? parsedUrl.data.replace(/\/$/, "") : null;
}
