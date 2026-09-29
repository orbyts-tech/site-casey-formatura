"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  detectGiftImageContentType,
  GIFT_IMAGE_CONTENT_TYPES,
  MAX_GIFT_IMAGE_BYTES,
  type GiftImageUpload,
} from "@/features/gifts/domain/gift-catalog";
import { MAX_GIFT_PRICE_IN_CENTS, parseBrlToCents } from "@/features/gifts/domain/money";
import { getGiftCatalogRepository } from "@/features/gifts/infrastructure/gift-catalog-repository-factory";
import { getGiftImageStorage } from "@/features/gifts/infrastructure/gift-image-storage";
import { actionFailure, actionSuccess, firstFieldErrors, type ActionResult } from "@/lib/action-result";
import { plainTextSchema } from "@/lib/plain-text";
import { ADMIN_ROUTES, ROUTES } from "@/lib/routes";
import { requireAdmin } from "../server/admin-session";

const giftIdSchema = z.string().trim().min(1).max(64);

const giftFormSchema = z.object({
  giftId: z
    .string()
    .trim()
    .max(64)
    .transform((giftId) => (giftId.length > 0 ? giftId : null)),
  name: plainTextSchema({
    minLength: 2,
    maxLength: 80,
    minLengthMessage: "Dê um nome ao presente.",
    maxLengthMessage: "Use no máximo 80 caracteres.",
  }),
  description: plainTextSchema({
    minLength: 4,
    maxLength: 240,
    minLengthMessage: "Escreva uma descrição curtinha.",
    maxLengthMessage: "A descrição pode ter até 240 caracteres.",
  }),
  price: z
    .string()
    .transform((rawPrice) => parseBrlToCents(rawPrice))
    .refine((priceInCents): priceInCents is number => priceInCents !== null, "Use um valor como 150,00.")
    .refine((priceInCents) => priceInCents >= 100, "O valor mínimo é R$ 1,00.")
    .refine((priceInCents) => priceInCents <= MAX_GIFT_PRICE_IN_CENTS, "Valor acima do permitido."),
  imageAlt: plainTextSchema({ minLength: 0, maxLength: 160, maxLengthMessage: "Use no máximo 160 caracteres." }),
});

const readText = (formData: FormData, fieldName: string): string => {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value : "";
};

type ImageReadResult =
  | { readonly kind: "missing" }
  | { readonly kind: "invalid"; readonly errorMessage: string }
  | { readonly kind: "valid"; readonly image: GiftImageUpload };

async function readImageUpload(formData: FormData): Promise<ImageReadResult> {
  const imageFile = formData.get("image");
  if (!(imageFile instanceof File) || imageFile.size === 0) return { kind: "missing" };

  if (imageFile.size > MAX_GIFT_IMAGE_BYTES) {
    return { kind: "invalid", errorMessage: "A imagem pode ter no máximo 5 MB." };
  }

  const bytes = new Uint8Array(await imageFile.arrayBuffer());
  const contentType = detectGiftImageContentType(bytes);
  if (!contentType || !GIFT_IMAGE_CONTENT_TYPES.includes(contentType)) {
    return { kind: "invalid", errorMessage: "Envie uma imagem JPG, PNG ou WebP." };
  }

  return { kind: "valid", image: { bytes, contentType } };
}

function revalidateGiftViews(): void {
  revalidatePath(ADMIN_ROUTES.overview);
  revalidatePath(ADMIN_ROUTES.gifts);
  revalidatePath(ROUTES.gifts);
  revalidatePath(ROUTES.giftsCheckout);
}

export async function saveGiftAction(formData: FormData): Promise<ActionResult<null>> {
  await requireAdmin();

  const parsedForm = giftFormSchema.safeParse({
    giftId: readText(formData, "giftId"),
    name: readText(formData, "name"),
    description: readText(formData, "description"),
    price: readText(formData, "price"),
    imageAlt: readText(formData, "imageAlt"),
  });
  if (!parsedForm.success) {
    const fieldErrors = firstFieldErrors(z.flattenError(parsedForm.error).fieldErrors);
    return actionFailure("Revise os dados do presente.", fieldErrors);
  }

  const imageUpload = await readImageUpload(formData);
  if (imageUpload.kind === "invalid") {
    return actionFailure(imageUpload.errorMessage, { image: imageUpload.errorMessage });
  }

  const { giftId, name, description, price, imageAlt } = parsedForm.data;
  const repository = getGiftCatalogRepository();

  try {
    const existingGift = giftId ? await repository.findById(giftId) : null;
    if (giftId && !existingGift) return actionFailure("Este presente não existe mais.");
    if (!existingGift && imageUpload.kind === "missing") {
      return actionFailure("Escolha uma foto para o presente.", { image: "Escolha uma foto para o presente." });
    }

    const imageUrl =
      imageUpload.kind === "valid" ? await getGiftImageStorage().upload(imageUpload.image) : (existingGift?.imageUrl ?? "");
    const draft = { name, description, priceInCents: price, imageUrl, imageAlt: imageAlt || name };

    if (existingGift) {
      await repository.update(existingGift.id, draft);
    } else {
      await repository.create(crypto.randomUUID(), draft);
    }

    revalidateGiftViews();
    return actionSuccess(null);
  } catch (error) {
    console.error("[admin] Falha ao salvar presente", error);
    return actionFailure("Não foi possível salvar o presente agora. Tente novamente.");
  }
}

export async function setGiftActiveAction(giftId: unknown, isActive: unknown): Promise<ActionResult<null>> {
  await requireAdmin();

  const parsedGiftId = giftIdSchema.safeParse(giftId);
  const parsedIsActive = z.boolean().safeParse(isActive);
  if (!parsedGiftId.success || !parsedIsActive.success) return actionFailure("Presente não encontrado.");

  try {
    await getGiftCatalogRepository().setActive(parsedGiftId.data, parsedIsActive.data);
    revalidateGiftViews();
    return actionSuccess(null);
  } catch (error) {
    console.error("[admin] Falha ao alterar visibilidade do presente", error);
    return actionFailure("Não foi possível atualizar o presente agora.");
  }
}

export async function deleteGiftAction(giftId: unknown): Promise<ActionResult<null>> {
  await requireAdmin();

  const parsedGiftId = giftIdSchema.safeParse(giftId);
  if (!parsedGiftId.success) return actionFailure("Presente não encontrado.");

  try {
    await getGiftCatalogRepository().delete(parsedGiftId.data);
    revalidateGiftViews();
    return actionSuccess(null);
  } catch (error) {
    console.error("[admin] Falha ao excluir presente", error);
    return actionFailure("Não foi possível excluir o presente agora.");
  }
}
