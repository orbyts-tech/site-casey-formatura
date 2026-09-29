"use client";

import { useState } from "react";
import type { ActionResult } from "@/lib/action-result";
import { useAdminMutation } from "./use-admin-mutation";

export function useDeleteConfirmation<TItem extends { readonly id: string }>(
  deleteAction: (itemId: string) => Promise<ActionResult<null>>,
) {
  const [pendingItem, setPendingItem] = useState<TItem | null>(null);
  const { isPending: isDeleting, errorMessage, run: runDelete, clearError } = useAdminMutation(deleteAction);

  const requestDelete = (item: TItem) => {
    clearError();
    setPendingItem(item);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setPendingItem(null);
  };

  const confirmDelete = async () => {
    if (!pendingItem) return;
    const result = await runDelete(pendingItem.id);
    if (result.isSuccess) setPendingItem(null);
  };

  return { pendingItem, isDeleting, errorMessage, requestDelete, cancelDelete, confirmDelete };
}
