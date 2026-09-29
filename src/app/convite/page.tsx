import type { Metadata } from "next";
import { InvitationExperience } from "@/features/invitation/components/invitation-experience";
import { getCurrentGuestInvitation } from "@/features/invitation/server/guest-invitation-session";

export const metadata: Metadata = {
  title: "Seu convite • Casey • Formatura em Psicologia 2027",
};

export default async function InvitationPage() {
  const invitation = await getCurrentGuestInvitation();
  return <InvitationExperience invitation={invitation} />;
}
