import "server-only";
import { createSupabaseAuthServerClient } from "@/infrastructure/supabase/auth-server-client";
import { isAllowedAdminEmail, type SupabaseAuthCredentials } from "@/infrastructure/server-config";
import type { AdminAuthGateway, AdminIdentity, AdminSignInOutcome } from "../domain/admin-auth";

export class SupabaseAdminAuthGateway implements AdminAuthGateway {
  constructor(private readonly credentials: SupabaseAuthCredentials) {}

  async signIn(email: string, password: string): Promise<AdminSignInOutcome> {
    const supabase = await createSupabaseAuthServerClient(this.credentials);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user?.email) return "invalidCredentials";

    if (!isAllowedAdminEmail(data.user.email)) {
      await supabase.auth.signOut();
      return "notAllowed";
    }
    return "signedIn";
  }

  async signOut(): Promise<void> {
    const supabase = await createSupabaseAuthServerClient(this.credentials);
    await supabase.auth.signOut();
  }

  async getCurrentAdmin(): Promise<AdminIdentity | null> {
    const supabase = await createSupabaseAuthServerClient(this.credentials);
    const { data, error } = await supabase.auth.getClaims();
    const email = data?.claims.email;
    if (error || typeof email !== "string" || !isAllowedAdminEmail(email)) return null;
    return { email };
  }
}
