import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { ADMIN_ROUTES } from "@/lib/routes";
import type { AdminIdentity } from "../domain/admin-auth";
import { getAdminAuthGateway } from "../infrastructure/admin-auth-gateway-factory";

export const getCurrentAdmin = cache(async (): Promise<AdminIdentity | null> => {
  await connection();

  const gateway = getAdminAuthGateway();
  if (!gateway) return null;
  return gateway.getCurrentAdmin();
});

export async function requireAdmin(): Promise<AdminIdentity> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect(ADMIN_ROUTES.signIn);
  return admin;
}
