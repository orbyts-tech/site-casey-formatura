"use client";

import { Check, Copy, MessageCircle } from "lucide-react";
import { getButtonClassName } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { buildInvitationShareMessage, buildWhatsAppShareUrl } from "../../domain/invitation-share";
import { IconActionButton, IconActionLink } from "../ui/icon-action";

interface InvitationShareProps {
  readonly greetingLine: string;
  readonly invitationLink: string;
  readonly graduateName: string;
}

const useInvitationShare = ({ greetingLine, invitationLink, graduateName }: InvitationShareProps) => {
  const { copyStatus, copyText } = useCopyToClipboard();
  const whatsAppUrl = buildWhatsAppShareUrl(buildInvitationShareMessage(greetingLine, invitationLink, graduateName));
  return { copyStatus, copyLink: () => copyText(invitationLink), whatsAppUrl };
};

export function InvitationShareButtons(props: InvitationShareProps) {
  const { copyStatus, copyLink, whatsAppUrl } = useInvitationShare(props);
  const hasCopied = copyStatus === "copied";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button type="button" onClick={copyLink} className={getButtonClassName({ size: "sm" }, "flex-1")}>
        {hasCopied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" strokeWidth={1.5} aria-hidden="true" />}
        {hasCopied ? "Link copiado!" : copyStatus === "failed" ? "Copie manualmente" : "Copiar link"}
      </button>
      <a
        href={whatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={getButtonClassName({ size: "sm", variant: "secondary" }, "flex-1")}
      >
        <MessageCircle className="size-4" strokeWidth={1.5} aria-hidden="true" />
        Enviar no WhatsApp
      </a>
    </div>
  );
}

export function InvitationShareIconActions(props: InvitationShareProps) {
  const { copyStatus, copyLink, whatsAppUrl } = useInvitationShare(props);
  const hasCopied = copyStatus === "copied";

  return (
    <>
      <IconActionButton label={hasCopied ? "Link copiado" : "Copiar link do convite"} onClick={copyLink}>
        {hasCopied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" strokeWidth={1.5} aria-hidden="true" />}
      </IconActionButton>
      <IconActionLink label="Enviar no WhatsApp" href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </IconActionLink>
    </>
  );
}
