"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getClientIp } from "@/infrastructure/security/client-ip";
import { isWithinRateLimit, RATE_LIMIT_POLICIES, RATE_LIMITED_MESSAGE } from "@/infrastructure/security/rate-limiter";
import { ADMIN_ROUTES } from "@/lib/routes";
import type { AdminSignInOutcome } from "../domain/admin-auth";
import { getAdminAuthGateway } from "../infrastructure/admin-auth-gateway-factory";

export interface AdminSignInFormState {
  readonly errorMessage: string | null;
  readonly email: string;
}

const signInSchema = z.object({
  email: z.email("Informe um e-mail válido.").trim().toLowerCase().max(254),
  password: z.string().min(1, "Informe sua senha.").max(200),
});

const SIGN_IN_ERROR_MESSAGES: Readonly<Record<Exclude<AdminSignInOutcome, "signedIn">, string>> = {
  invalidCredentials: "E-mail ou senha incorretos.",
  notAllowed: "Este acesso é exclusivo da Casey.",
};

export async function signInAdminAction(
  _previousState: AdminSignInFormState,
  formData: FormData,
): Promise<AdminSignInFormState> {
  const rawEmail = formData.get("email");
  const typedEmail = typeof rawEmail === "string" ? rawEmail.slice(0, 254) : "";

  const parsedInput = signInSchema.safeParse({ email: rawEmail, password: formData.get("password") });
  if (!parsedInput.success) {
    return { errorMessage: parsedInput.error.issues[0]?.message ?? "Revise os dados.", email: typedEmail };
  }

  const [isIpWithinLimit, isEmailWithinLimit] = await Promise.all([
    getClientIp().then((clientIp) => isWithinRateLimit(RATE_LIMIT_POLICIES.adminSignInByIp, clientIp)),
    isWithinRateLimit(RATE_LIMIT_POLICIES.adminSignInByEmail, parsedInput.data.email),
  ]);
  if (!isIpWithinLimit || !isEmailWithinLimit) return { errorMessage: RATE_LIMITED_MESSAGE, email: typedEmail };

  const gateway = getAdminAuthGateway();
  if (!gateway) {
    return { errorMessage: "O painel ainda não foi configurado no servidor.", email: typedEmail };
  }

  let outcome: AdminSignInOutcome;
  try {
    outcome = await gateway.signIn(parsedInput.data.email, parsedInput.data.password);
  } catch (error) {
    console.error("[admin] Falha ao entrar", error);
    return { errorMessage: "Não foi possível entrar agora. Tente novamente.", email: typedEmail };
  }

  if (outcome !== "signedIn") return { errorMessage: SIGN_IN_ERROR_MESSAGES[outcome], email: typedEmail };

  redirect(ADMIN_ROUTES.overview);
}

export async function signOutAdminAction(): Promise<void> {
  const gateway = getAdminAuthGateway();
  await gateway?.signOut();
  redirect(ADMIN_ROUTES.signIn);
}
