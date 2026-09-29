import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSignInScreen } from "@/features/admin/components/sign-in/admin-sign-in-screen";
import { getCurrentAdmin } from "@/features/admin/server/admin-session";
import { graduate } from "@/features/graduation/data/graduation";
import { ADMIN_ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Entrar",
};

export default async function AdminSignInPage() {
  const admin = await getCurrentAdmin();
  if (admin) redirect(ADMIN_ROUTES.overview);

  return <AdminSignInScreen graduateName={graduate.name} graduatePhotoUrl={graduate.celebrationPhotoUrl} />;
}
