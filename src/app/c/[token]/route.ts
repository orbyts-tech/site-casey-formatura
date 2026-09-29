import { NextResponse, type NextRequest } from "next/server";
import { isValidInvitationToken } from "@/features/invitation/domain/invitation-record";
import { getInvitationRepository } from "@/features/invitation/infrastructure/invitation-repository-factory";
import {
  GUEST_INVITATION_COOKIE,
  guestInvitationCookieOptions,
} from "@/features/invitation/server/guest-invitation-session";
import { ROUTES } from "@/lib/routes";

export async function GET(request: NextRequest, context: RouteContext<"/c/[token]">) {
  const { token } = await context.params;
  const response = NextResponse.redirect(new URL(ROUTES.invitation, request.url));
  if (!isValidInvitationToken(token)) return response;

  try {
    const repository = getInvitationRepository();
    const invitation = await repository.findByToken(token);
    if (!invitation) return response;

    await repository.markOpened(invitation.id, new Date().toISOString());
    response.cookies.set(GUEST_INVITATION_COOKIE, invitation.token, guestInvitationCookieOptions);
  } catch (error) {
    console.error("[convite] Falha ao abrir link do convite", error);
  }

  return response;
}
