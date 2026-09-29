import { InvitationExperience } from "@/features/invitation/components/invitation-experience";
import { getCurrentGuestInvitation } from "@/features/invitation/server/guest-invitation-session";
import { HomeEntryGate } from "@/features/journey/components/home-entry-gate";
import { JourneyScreen } from "@/features/journey/components/journey-screen";

export default async function HomePage() {
  const invitation = await getCurrentGuestInvitation();

  return (
    <HomeEntryGate
      firstVisitScreen={<InvitationExperience invitation={invitation} />}
      returningGuestScreen={<JourneyScreen />}
    />
  );
}
