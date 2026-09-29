import "server-only";
import { cookies } from "next/headers";
import { isAllowedAdminEmail, type DevelopmentAdminCredentials } from "@/infrastructure/server-config";
import type { AdminAuthGateway, AdminIdentity, AdminSignInOutcome } from "../domain/admin-auth";
import {
  areSecretsEqual,
  createDevelopmentAdminSessionToken,
  DEVELOPMENT_ADMIN_COOKIE,
  DEVELOPMENT_ADMIN_SESSION_SECONDS,
  readDevelopmentAdminSessionEmail,
} from "./development-admin-session-token";

export class DevelopmentAdminAuthGateway implements AdminAuthGateway {
  constructor(private readonly credentials: DevelopmentAdminCredentials) {}

  async signIn(email: string, password: string): Promise<AdminSignInOutcome> {
    const isPasswordCorrect = areSecretsEqual(password, this.credentials.password);
    if (!isPasswordCorrect) return "invalidCredentials";
    if (!isAllowedAdminEmail(email)) return "notAllowed";

    const cookieStore = await cookies();
    cookieStore.set(DEVELOPMENT_ADMIN_COOKIE, createDevelopmentAdminSessionToken(email, this.credentials.sessionSecret), {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: DEVELOPMENT_ADMIN_SESSION_SECONDS,
    });
    return "signedIn";
  }

  async signOut(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(DEVELOPMENT_ADMIN_COOKIE);
  }

  async getCurrentAdmin(): Promise<AdminIdentity | null> {
    const cookieStore = await cookies();
    const email = readDevelopmentAdminSessionEmail(
      cookieStore.get(DEVELOPMENT_ADMIN_COOKIE)?.value,
      this.credentials.sessionSecret,
    );
    if (!email || !isAllowedAdminEmail(email)) return null;
    return { email };
  }
}
