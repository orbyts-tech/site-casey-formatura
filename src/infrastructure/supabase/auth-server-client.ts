import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { SupabaseAuthCredentials } from "../server-config";

export async function createSupabaseAuthServerClient(credentials: SupabaseAuthCredentials): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(credentials.url, credentials.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies; the proxy refreshes the session on the next request.
        }
      },
    },
  });
}
