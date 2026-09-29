"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GiftRecord } from "@/features/gifts/domain/gift-catalog";
import { pluralize } from "../../domain/admin-formatters";
import { useGiftCatalogAdmin } from "../../hooks/use-gift-catalog-admin";
import { AdminPageHeader } from "../ui/admin-page-header";
import { AdminSurface } from "../ui/admin-surface";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { EmptyState } from "../ui/empty-state";
import { GiftAdminCard } from "./gift-admin-card";
import { GiftFormModal } from "./gift-form-modal";

interface GiftsAdminScreenProps {
  readonly gifts: readonly GiftRecord[];
  readonly timesGivenByGiftId: Readonly<Record<string, number>>;
}

export function GiftsAdminScreen({ gifts, timesGivenByGiftId }: GiftsAdminScreenProps) {
  const {
    editorState,
    openNewGift,
    openGiftEditor,
    closeEditor,
    togglingGiftId,
    visibilityErrorMessage,
    toggleGiftVisibility,
    deleteConfirmation,
  } = useGiftCatalogAdmin();

  const activeGiftCount = gifts.filter((gift) => gift.isActive).length;
  const addGiftButton = (
    <Button size="sm" onClick={openNewGift} leadingIcon={<Plus className="size-4" aria-hidden="true" />}>
      Adicionar presente
    </Button>
  );

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Lista de presentes"
        title="Seus desejos,"
        highlightedTitle="com carinho."
        description={`${pluralize(activeGiftCount, "presente visível", "presentes visíveis")} para os convidados. Edite valores, troque fotos ou oculte itens sem perder o histórico.`}
        actions={addGiftButton}
      />

      {visibilityErrorMessage && (
        <p role="alert" className="text-sm text-red-700">
          {visibilityErrorMessage}
        </p>
      )}

      {gifts.length === 0 ? (
        <AdminSurface>
          <EmptyState
            title="Sua lista está vazia"
            description="Adicione o primeiro presente com foto, descrição e valor."
            action={addGiftButton}
          />
        </AdminSurface>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {gifts.map((gift) => (
            <GiftAdminCard
              key={gift.id}
              gift={gift}
              timesGiven={timesGivenByGiftId[gift.id] ?? 0}
              isUpdatingVisibility={togglingGiftId === gift.id}
              onEdit={openGiftEditor}
              onToggleVisibility={toggleGiftVisibility}
              onRequestDelete={deleteConfirmation.requestDelete}
            />
          ))}
        </ul>
      )}

      <GiftFormModal isOpen={editorState.isOpen} editingGift={editorState.editingGift} onClose={closeEditor} />

      <ConfirmDialog
        isOpen={deleteConfirmation.pendingItem !== null}
        title="Excluir este presente?"
        description={
          deleteConfirmation.pendingItem
            ? `"${deleteConfirmation.pendingItem.name}" sai da lista. Os presentes já recebidos continuam no histórico. Se preferir, você pode apenas ocultá-lo.`
            : ""
        }
        confirmLabel="Excluir presente"
        isConfirming={deleteConfirmation.isDeleting}
        errorMessage={deleteConfirmation.errorMessage}
        onConfirm={deleteConfirmation.confirmDelete}
        onCancel={deleteConfirmation.cancelDelete}
      />
    </div>
  );
}
