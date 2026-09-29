"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getGiftContributionRepository } from "@/features/gifts/infrastructure/gift-contribution-repository-factory";
import { actionFailure, actionSuccess, type ActionResult } from "@/lib/action-result";
import { ADMIN_ROUTES } from "@/lib/routes";
import { requireAdmin } from "../server/admin-session";

const contributionIdSchema = z.uuid();

export async function confirmContributionAction(contributionId: unknown): Promise<ActionResult<null>> {
  await requireAdmin();

  const parsedContributionId = contributionIdSchema.safeParse(contributionId);
  if (!parsedContributionId.success) return actionFailure("Presente não encontrado.");

  try {
    await getGiftContributionRepository().markAsConfirmed(parsedContributionId.data);
    revalidatePath(ADMIN_ROUTES.overview);
    revalidatePath(ADMIN_ROUTES.contributions);
    return actionSuccess(null);
  } catch (error) {
    console.error("[admin] Falha ao confirmar recebimento", error);
    return actionFailure("Não foi possível confirmar agora. Tente novamente.");
  }
}
