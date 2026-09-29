import type { Metadata } from "next";
import { GiftsAdminScreen } from "@/features/admin/components/gifts/gifts-admin-screen";
import { countGiftsGiven } from "@/features/admin/domain/contribution-list-item";
import { requireAdmin } from "@/features/admin/server/admin-session";
import { getGiftCatalogRepository } from "@/features/gifts/infrastructure/gift-catalog-repository-factory";
import { getGiftContributionRepository } from "@/features/gifts/infrastructure/gift-contribution-repository-factory";

export const metadata: Metadata = {
  title: "Lista de presentes",
};

export default async function AdminGiftsPage() {
  await requireAdmin();

  const [gifts, contributions] = await Promise.all([
    getGiftCatalogRepository().listAll(),
    getGiftContributionRepository().listAll(),
  ]);

  return <GiftsAdminScreen gifts={gifts} timesGivenByGiftId={countGiftsGiven(contributions)} />;
}
