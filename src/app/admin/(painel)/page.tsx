import type { Metadata } from "next";
import { AdminOverview } from "@/features/admin/components/overview/admin-overview";
import { requireAdmin } from "@/features/admin/server/admin-session";
import { getGiftCatalogRepository } from "@/features/gifts/infrastructure/gift-catalog-repository-factory";
import { getGiftContributionRepository } from "@/features/gifts/infrastructure/gift-contribution-repository-factory";
import { graduate } from "@/features/graduation/data/graduation";
import { getInvitationRepository } from "@/features/invitation/infrastructure/invitation-repository-factory";

export const metadata: Metadata = {
  title: "Visão geral",
};

export default async function AdminOverviewPage() {
  await requireAdmin();

  const [invitations, contributions, activeGifts] = await Promise.all([
    getInvitationRepository().listAll(),
    getGiftContributionRepository().listAll(),
    getGiftCatalogRepository().listActive(),
  ]);

  return (
    <AdminOverview
      graduateName={graduate.name}
      invitations={invitations}
      contributions={contributions}
      activeGiftCount={activeGifts.length}
    />
  );
}
