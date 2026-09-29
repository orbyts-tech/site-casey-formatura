"use client";

import { useState } from "react";
import type { GiftRecord } from "@/features/gifts/domain/gift-catalog";
import { deleteGiftAction, setGiftActiveAction } from "../actions/gift-admin-actions";
import { useAdminMutation } from "./use-admin-mutation";
import { useDeleteConfirmation } from "./use-delete-confirmation";

interface GiftEditorState {
  readonly isOpen: boolean;
  readonly editingGift: GiftRecord | null;
}

export function useGiftCatalogAdmin() {
  const [editorState, setEditorState] = useState<GiftEditorState>({ isOpen: false, editingGift: null });
  const [togglingGiftId, setTogglingGiftId] = useState<string | null>(null);
  const { errorMessage: visibilityErrorMessage, run: runSetGiftActive } = useAdminMutation(setGiftActiveAction);
  const deleteConfirmation = useDeleteConfirmation<GiftRecord>(deleteGiftAction);

  const openNewGift = () => setEditorState({ isOpen: true, editingGift: null });
  const openGiftEditor = (gift: GiftRecord) => setEditorState({ isOpen: true, editingGift: gift });
  const closeEditor = () => setEditorState((currentState) => ({ ...currentState, isOpen: false }));

  const toggleGiftVisibility = async (gift: GiftRecord) => {
    setTogglingGiftId(gift.id);
    await runSetGiftActive(gift.id, !gift.isActive);
    setTogglingGiftId(null);
  };

  return {
    editorState,
    openNewGift,
    openGiftEditor,
    closeEditor,
    togglingGiftId,
    visibilityErrorMessage,
    toggleGiftVisibility,
    deleteConfirmation,
  };
}
