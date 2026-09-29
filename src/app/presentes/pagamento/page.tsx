import type { Metadata } from "next";
import { connection } from "next/server";
import { BotanicalBackdrop } from "@/components/brand/botanical-backdrop";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { graduate } from "@/features/graduation/data/graduation";
import { CheckoutView } from "@/features/gifts/components/checkout/checkout-view";
import { getGiftCatalogRepository } from "@/features/gifts/infrastructure/gift-catalog-repository-factory";
import { GiftCatalogProvider } from "@/features/gifts/state/gift-catalog-context";
import { formatGuestList } from "@/features/invitation/domain/invitation";
import { getCurrentGuestInvitation } from "@/features/invitation/server/guest-invitation-session";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Pagamento • Presentes • Casey",
  description: "Finalize seu presente para a Casey com Pix.",
  robots: { index: false },
};

export default async function GiftsCheckoutPage() {
  await connection();

  const [gifts, invitation] = await Promise.all([
    getGiftCatalogRepository().listActive(),
    getCurrentGuestInvitation(),
  ]);

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-clip">
      <BotanicalBackdrop />
      <SiteHeader
        graduateName={graduate.name}
        course={graduate.course}
        graduationYear={graduate.graduationYear}
        activeRoute={ROUTES.gifts}
      />
      <div className="relative flex-1 px-5 pb-16 pt-6 sm:px-8 lg:pb-24 lg:pt-10">
        <GiftCatalogProvider gifts={gifts}>
          <CheckoutView graduateName={graduate.name} suggestedGiverName={formatGuestList(invitation.guests)} />
        </GiftCatalogProvider>
      </div>
      <SiteFooter />
    </main>
  );
}
