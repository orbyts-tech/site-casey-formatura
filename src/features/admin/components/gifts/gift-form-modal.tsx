"use client";

import Image from "next/image";
import { useId } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TextArea, TextInput } from "@/components/ui/text-field";
import { GIFT_IMAGE_CONTENT_TYPES, type GiftRecord } from "@/features/gifts/domain/gift-catalog";
import { formatCentsAsDecimalInput } from "@/features/gifts/domain/money";
import { useGiftForm } from "../../hooks/use-gift-form";

interface GiftFormModalProps {
  readonly isOpen: boolean;
  readonly editingGift: GiftRecord | null;
  readonly onClose: () => void;
}

interface GiftFormProps {
  readonly titleId: string;
  readonly editingGift: GiftRecord | null;
  readonly onClose: () => void;
}

function GiftForm({ titleId, editingGift, onClose }: GiftFormProps) {
  const { previewImageUrl, fieldErrors, errorMessage, isSaving, selectImage, submitGift } = useGiftForm(editingGift, onClose);
  const isEditing = editingGift !== null;

  return (
    <form onSubmit={submitGift} className="flex flex-col gap-5 px-4 pb-5 pt-7 sm:px-6 sm:pb-6" noValidate>
      <div className="pr-8">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gold">{isEditing ? "Editar presente" : "Novo presente"}</p>
        <h2 id={titleId} className="mt-1 font-serif text-2xl text-forest">
          {isEditing ? editingGift.name : "O que você gostaria de ganhar?"}
        </h2>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-serif text-base text-forest">Foto</span>
        <label
          className={`group relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed bg-ivory transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest ${
            fieldErrors.image ? "border-red-400" : "border-gold-soft hover:border-gold"
          }`}
        >
          {previewImageUrl ? (
            <>
              <Image src={previewImageUrl} alt="" fill sizes="(min-width: 640px) 460px, 90vw" className="object-cover" />
              <span className="absolute inset-x-0 bottom-0 bg-forest-deep/70 py-2 text-center text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100 group-has-[:focus-visible]:opacity-100">
                Trocar foto
              </span>
            </>
          ) : (
            <span className="flex flex-col items-center gap-2 text-ink-soft">
              <ImagePlus className="size-7 text-gold" strokeWidth={1.3} aria-hidden="true" />
              <span className="text-sm">Escolher foto</span>
              <span className="text-xs">JPG, PNG ou WebP • até 5 MB</span>
            </span>
          )}
          <input
            type="file"
            name="image"
            accept={GIFT_IMAGE_CONTENT_TYPES.join(",")}
            onChange={selectImage}
            aria-label={previewImageUrl ? "Trocar foto do presente" : "Escolher foto do presente"}
            aria-invalid={Boolean(fieldErrors.image)}
            className="sr-only"
          />
        </label>
        {fieldErrors.image && <p className="text-sm text-red-700">{fieldErrors.image}</p>}
      </div>

      <TextInput
        id="gift-name"
        name="name"
        label="Nome do presente"
        placeholder="Ex.: Livros para a biblioteca"
        defaultValue={editingGift?.name}
        maxLength={80}
        errorMessage={fieldErrors.name}
        required
      />
      <TextArea
        id="gift-description"
        name="description"
        label="Descrição"
        placeholder="Uma frase carinhosa sobre o presente"
        defaultValue={editingGift?.description}
        maxLength={240}
        rows={3}
        errorMessage={fieldErrors.description}
        required
      />
      <div className="grid gap-5 sm:grid-cols-[10rem_1fr]">
        <TextInput
          id="gift-price"
          name="price"
          label="Valor (R$)"
          inputMode="decimal"
          placeholder="150,00"
          defaultValue={editingGift ? formatCentsAsDecimalInput(editingGift.priceInCents) : undefined}
          errorMessage={fieldErrors.price}
          required
        />
        <TextInput
          id="gift-image-alt"
          name="imageAlt"
          label="Descrição da foto (opcional)"
          placeholder="Para leitores de tela"
          defaultValue={editingGift?.imageAlt}
          maxLength={160}
          errorMessage={fieldErrors.imageAlt}
        />
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-gold-soft/50 pt-5 sm:flex-row sm:justify-end">
        <Button variant="secondary" size="sm" onClick={onClose} disabled={isSaving}>
          Cancelar
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSaving}
          leadingIcon={isSaving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : undefined}
        >
          {isSaving ? "Salvando..." : isEditing ? "Salvar alterações" : "Adicionar à lista"}
        </Button>
      </div>
    </form>
  );
}

export function GiftFormModal({ isOpen, editingGift, onClose }: GiftFormModalProps) {
  const titleId = useId();

  return (
    <Modal isOpen={isOpen} onClose={onClose} titleId={titleId}>
      <GiftForm key={editingGift?.id ?? "new-gift"} titleId={titleId} editingGift={editingGift} onClose={onClose} />
    </Modal>
  );
}
