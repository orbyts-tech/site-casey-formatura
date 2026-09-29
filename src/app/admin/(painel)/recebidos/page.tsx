import type { Metadata } from "next";
import { ContributionsScreen } from "@/features/admin/components/contributions/contributions-screen";
import { toContributionListItems } from "@/features/admin/domain/contribution-list-item";
import { requireAdmin } from "@/features/admin/server/admin-session";
import { getGiftContributionRepository } from "@/features/gifts/infrastructure/gift-contribution-repository-factory";
import { getInvitationRepository } from "@/features/invitation/infrastructure/invitation-repository-factory";

export const metadata: Metadata = {
  title: "Presentes recebidos",
};

export default async function AdminContributionsPage() {
  await requireAdmin();

  const [contributions, invitations] = await Promise.all([
    getGiftContributionRepository().listAll(),
    getInvitationRepository().listAll(),
  ]);

  return <ContributionsScreen contributions={toContributionListItems(contributions, invitations)} />;
}
