"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  GIFT_IMAGE_CONTENT_TYPES,
  MAX_GIFT_IMAGE_BYTES,
  type GiftImageContentType,
  type GiftRecord,
} from "@/features/gifts/domain/gift-catalog";
import type { FieldErrors } from "@/lib/action-result";
import { saveGiftAction } from "../actions/gift-admin-actions";
import { useAdminMutation } from "./use-admin-mutation";

const isAcceptedImageType = (contentType: string): contentType is GiftImageContentType =>
  (GIFT_IMAGE_CONTENT_TYPES as readonly string[]).includes(contentType);

function validateImageFile(imageFile: File): string | null {
  if (!isAcceptedImageType(imageFile.type)) return "Envie uma imagem JPG, PNG ou WebP.";
  if (imageFile.size > MAX_GIFT_IMAGE_BYTES) return "A imagem pode ter no máximo 5 MB.";
  return null;
}

export function useGiftForm(editingGift: GiftRecord | null, onSaved: () => void) {
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const { isPending: isSaving, errorMessage, run: runSaveGift } = useAdminMutation(saveGiftAction);

  useEffect(() => {
    if (!selectedImagePreviewUrl) return;
    return () => URL.revokeObjectURL(selectedImagePreviewUrl);
  }, [selectedImagePreviewUrl]);

  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];
    if (!imageFile) {
      setSelectedImagePreviewUrl(null);
      return;
    }

    const imageError = validateImageFile(imageFile);
    if (imageError) {
      event.target.value = "";
      setSelectedImagePreviewUrl(null);
      setFieldErrors((currentErrors) => ({ ...currentErrors, image: imageError }));
      return;
    }

    setFieldErrors((currentErrors) => ({ ...currentErrors, image: undefined }));
    setSelectedImagePreviewUrl(URL.createObjectURL(imageFile));
  };

  const submitGift = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (editingGift) formData.set("giftId", editingGift.id);

    const result = await runSaveGift(formData);
    if (!result.isSuccess) {
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }

    setFieldErrors({});
    onSaved();
  };

  const previewImageUrl = selectedImagePreviewUrl ?? editingGift?.imageUrl ?? null;

  return { previewImageUrl, fieldErrors, errorMessage, isSaving, selectImage, submitGift };
}
