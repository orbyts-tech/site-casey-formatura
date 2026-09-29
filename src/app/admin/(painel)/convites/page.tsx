import type { Metadata } from "next";
import { InvitationsScreen } from "@/features/admin/components/invitations/invitations-screen";
import { requireAdmin } from "@/features/admin/server/admin-session";
import { resolveSiteOrigin } from "@/features/admin/server/site-origin";
import { graduate } from "@/features/graduation/data/graduation";
import { getInvitationRepository } from "@/features/invitation/infrastructure/invitation-repository-factory";

export const metadata: Metadata = {
  title: "Convites",
};

export default async function AdminInvitationsPage() {
  await requireAdmin();

  const [invitations, siteOrigin] = await Promise.all([getInvitationRepository().listAll(), resolveSiteOrigin()]);

  return <InvitationsScreen invitations={invitations} siteOrigin={siteOrigin} graduateName={graduate.name} />;
}
