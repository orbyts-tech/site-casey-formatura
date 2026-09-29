import type { InvitationRecord } from "@/features/invitation/domain/invitation-record";
import { AdminPageHeader } from "../ui/admin-page-header";
import { InvitationCreatePanel } from "./invitation-create-panel";
import { InvitationList } from "./invitation-list";

interface InvitationsScreenProps {
  readonly invitations: readonly InvitationRecord[];
  readonly siteOrigin: string;
  readonly graduateName: string;
}

export function InvitationsScreen({ invitations, siteOrigin, graduateName }: InvitationsScreenProps) {
  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Convites"
        title="Cada convite,"
        highlightedTitle="um carinho."
        description="Escreva o nome como quer que apareça no envelope, gere o link exclusivo e envie. As respostas chegam aqui automaticamente."
      />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,23rem)_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-8">
          <InvitationCreatePanel siteOrigin={siteOrigin} graduateName={graduateName} />
        </div>
        <InvitationList invitations={invitations} siteOrigin={siteOrigin} graduateName={graduateName} />
      </div>
    </div>
  );
}
