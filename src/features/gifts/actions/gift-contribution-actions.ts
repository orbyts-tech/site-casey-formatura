"use server";

import QRCode from "qrcode";
import { z } from "zod";
import { getCurrentInvitationRecord } from "@/features/invitation/server/guest-invitation-session";
import { getClientIp } from "@/infrastructure/security/client-ip";
import { isWithinRateLimit, RATE_LIMIT_POLICIES, RATE_LIMITED_MESSAGE } from "@/infrastructure/security/rate-limiter";
import type { ActionResult } from "@/lib/action-result";
import { plainTextSchema } from "@/lib/plain-text";
import { createGiftContribution } from "../application/create-gift-contribution";
import { MAX_DISTINCT_GIFTS_PER_CART, MAX_QUANTITY_PER_GIFT } from "../domain/cart";
import { EmptyGiftCartError } from "../domain/gift-contribution";
import { getGiftCatalogRepository } from "../infrastructure/gift-catalog-repository-factory";
import { getGiftContributionRepository } from "../infrastructure/gift-contribution-repository-factory";
import { getPixReceiver } from "../infrastructure/gifts-server-config";

export interface PixCheckout {
  readonly contributionId: string;
  readonly pixPayload: string;
  readonly qrCodeDataUrl: string;
  readonly totalInCents: number;
  readonly receiverName: string;
}

const createGiftContributionSchema = z.object({
  giverName: plainTextSchema({
    minLength: 2,
    maxLength: 80,
    minLengthMessage: "Conte pra Casey quem está presenteando (mínimo 2 letras).",
    maxLengthMessage: "Use no máximo 80 caracteres.",
  }),
  message: plainTextSchema({
    minLength: 0,
    maxLength: 500,
    maxLengthMessage: "A mensagem pode ter até 500 caracteres.",
    allowLineBreaks: true,
  }).transform((message) => (message.length > 0 ? message : null)),
  lines: z
    .array(
      z.object({
        giftId: z.string().min(1).max(64),
        quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_GIFT),
      }),
    )
    .min(1, "Escolha pelo menos um presente.")
    .max(MAX_DISTINCT_GIFTS_PER_CART)
    .refine((lines) => new Set(lines.map((line) => line.giftId)).size === lines.length, "Presentes repetidos na sacola."),
});

const contributionIdSchema = z.uuid();

const GENERIC_ERROR_MESSAGE = "Não foi possível gerar o Pix agora. Tente novamente em instantes.";

export async function createGiftContributionAction(input: unknown): Promise<ActionResult<PixCheckout>> {
  if (!(await isWithinRateLimit(RATE_LIMIT_POLICIES.giftContribution, await getClientIp()))) {
    return { isSuccess: false, errorMessage: RATE_LIMITED_MESSAGE };
  }

  const parsedInput = createGiftContributionSchema.safeParse(input);
  if (!parsedInput.success) {
    const { fieldErrors } = z.flattenError(parsedInput.error);
    return {
      isSuccess: false,
      errorMessage: "Revise os dados antes de continuar.",
      fieldErrors: {
        giverName: fieldErrors.giverName?.[0],
        message: fieldErrors.message?.[0],
        lines: fieldErrors.lines?.[0],
      },
    };
  }

  try {
    const [catalog, invitation] = await Promise.all([
      getGiftCatalogRepository().listActive(),
      getCurrentInvitationRecord(),
    ]);

    const createdContribution = await createGiftContribution(
      { ...parsedInput.data, invitationId: invitation?.id ?? null },
      {
        catalog,
        repository: getGiftContributionRepository(),
        pixReceiver: getPixReceiver(),
        generateId: () => crypto.randomUUID(),
      },
    );

    const qrCodeDataUrl = await QRCode.toDataURL(createdContribution.pixPayload, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 480,
      color: { dark: "#153326", light: "#fcfaf5" },
    });

    return { isSuccess: true, data: { ...createdContribution, qrCodeDataUrl } };
  } catch (error) {
    if (error instanceof EmptyGiftCartError) {
      return { isSuccess: false, errorMessage: "Sua sacola está vazia. Escolha um presente para continuar." };
    }
    console.error("[presentes] Falha ao criar contribuição", error);
    return { isSuccess: false, errorMessage: GENERIC_ERROR_MESSAGE };
  }
}

export async function reportGiftPaymentAction(contributionId: unknown): Promise<ActionResult<null>> {
  if (!(await isWithinRateLimit(RATE_LIMIT_POLICIES.giftPaymentReport, await getClientIp()))) {
    return { isSuccess: false, errorMessage: RATE_LIMITED_MESSAGE };
  }

  const parsedContributionId = contributionIdSchema.safeParse(contributionId);
  if (!parsedContributionId.success) {
    return { isSuccess: false, errorMessage: "Presente não encontrado." };
  }

  try {
    await getGiftContributionRepository().markAsReportedPaid(parsedContributionId.data);
    return { isSuccess: true, data: null };
  } catch (error) {
    console.error("[presentes] Falha ao informar pagamento", error);
    return { isSuccess: false, errorMessage: "Não conseguimos registrar agora, mas fique tranquilo: a Casey confere pelo banco." };
  }
}
