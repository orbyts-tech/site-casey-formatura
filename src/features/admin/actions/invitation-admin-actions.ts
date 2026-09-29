"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createInvitation } from "@/features/invitation/application/create-invitation";
import { GREETING_PREFIXES, MAX_GUESTS_PER_INVITATION } from "@/features/invitation/domain/invitation-record";
import { getInvitationRepository } from "@/features/invitation/infrastructure/invitation-repository-factory";
import { actionFailure, actionSuccess, firstFieldErrors, type ActionResult } from "@/lib/action-result";
import { plainTextSchema } from "@/lib/plain-text";
import { ADMIN_ROUTES } from "@/lib/routes";
import { requireAdmin } from "../server/admin-session";

export interface CreatedInvitation {
  readonly invitationId: string;
  readonly token: string;
}

const personNameSchema = plainTextSchema({
  minLength: 2,
  maxLength: 60,
  minLengthMessage: "Cada nome precisa ter pelo menos 2 letras.",
  maxLengthMessage: "Use no máximo 60 caracteres por nome.",
});

const createInvitationSchema = z.object({
  greetingPrefix: z.enum(GREETING_PREFIXES, "Escolha uma saudação."),
  greetingName: plainTextSchema({
    minLength: 2,
    maxLength: 80,
    minLengthMessage: "Informe como a pessoa será chamada no convite.",
    maxLengthMessage: "Use no máximo 80 caracteres.",
  }),
  guestNames: z
    .array(personNameSchema)
    .max(MAX_GUESTS_PER_INVITATION, `Até ${MAX_GUESTS_PER_INVITATION} convidados por convite.`),
});

const invitationIdSchema = z.uuid();

const generateInvitationToken = (): string => randomBytes(16).toString("base64url");

function revalidateInvitationViews(): void {
  revalidatePath(ADMIN_ROUTES.overview);
  revalidatePath(ADMIN_ROUTES.invitations);
}

export async function createInvitationAction(input: unknown): Promise<ActionResult<CreatedInvitation>> {
  await requireAdmin();

  const parsedInput = createInvitationSchema.safeParse(input);
  if (!parsedInput.success) {
    const fieldErrors = firstFieldErrors(z.flattenError(parsedInput.error).fieldErrors);
    return actionFailure("Revise os dados do convite.", fieldErrors);
  }

  try {
    const createdInvitation = await createInvitation(parsedInput.data, {
      repository: getInvitationRepository(),
      generateId: () => crypto.randomUUID(),
      generateToken: generateInvitationToken,
    });
    revalidateInvitationViews();
    return actionSuccess({ invitationId: createdInvitation.id, token: createdInvitation.token });
  } catch (error) {
    console.error("[admin] Falha ao criar convite", error);
    return actionFailure("Não foi possível criar o convite agora. Tente novamente.");
  }
}

export async function deleteInvitationAction(invitationId: unknown): Promise<ActionResult<null>> {
  await requireAdmin();

  const parsedInvitationId = invitationIdSchema.safeParse(invitationId);
  if (!parsedInvitationId.success) return actionFailure("Convite não encontrado.");

  try {
    await getInvitationRepository().delete(parsedInvitationId.data);
    revalidateInvitationViews();
    return actionSuccess(null);
  } catch (error) {
    console.error("[admin] Falha ao excluir convite", error);
    return actionFailure("Não foi possível excluir o convite agora.");
  }
}
