import { guestInvitationLinkPath } from "@/lib/routes";

export function buildInvitationLink(siteOrigin: string, token: string): string {
  return `${siteOrigin}${guestInvitationLinkPath(token)}`;
}

export function buildInvitationShareMessage(greetingLine: string, invitationLink: string, graduateName: string): string {
  return [
    `${greetingLine}!`,
    `Preparei um convite especial para você celebrar comigo a minha formatura. Abra com carinho:`,
    invitationLink,
    `Com amor, ${graduateName}`,
  ].join("\n\n");
}

export function buildWhatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
