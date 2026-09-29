"use client";

import Image from "next/image";
import { Eye, EyeOff, Heart, Pencil, Trash2 } from "lucide-react";
import type { GiftRecord } from "@/features/gifts/domain/gift-catalog";
import { formatCentsAsBrl } from "@/features/gifts/domain/money";
import { ADMIN_SURFACE_CLASSES } from "../ui/admin-surface";
import { IconActionButton } from "../ui/icon-action";

interface GiftAdminCardProps {
  readonly gift: GiftRecord;
  readonly timesGiven: number;
  readonly isUpdatingVisibility: boolean;
  readonly onEdit: (gift: GiftRecord) => void;
  readonly onToggleVisibility: (gift: GiftRecord) => void;
  readonly onRequestDelete: (gift: GiftRecord) => void;
}

export function GiftAdminCard({
  gift,
  timesGiven,
  isUpdatingVisibility,
  onEdit,
  onToggleVisibility,
  onRequestDelete,
}: GiftAdminCardProps) {
  return (
    <li className={`${ADMIN_SURFACE_CLASSES} flex flex-col overflow-hidden ${gift.isActive ? "" : "opacity-75"}`}>
      <div className="relative aspect-[4/3] bg-ivory">
        <Image
          src={gift.imageUrl}
          alt={gift.imageAlt}
          fill
          sizes="(min-width: 1280px) 340px, (min-width: 640px) 45vw, 90vw"
          className={`object-cover ${gift.isActive ? "" : "grayscale"}`}
        />
        {!gift.isActive && (
          <span className="absolute left-3 top-3 rounded-full bg-forest-deep/80 px-3 py-1 text-[0.7rem] tracking-wide text-paper">
            Oculto na lista
          </span>
        )}
        {timesGiven > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-paper/95 px-2.5 py-1 text-[0.7rem] text-forest shadow-sm">
            <Heart className="size-3 fill-current" aria-hidden="true" />
            {timesGiven}x
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg leading-snug text-forest">{gift.name}</h3>
          <p className="shrink-0 font-serif text-lg text-gold tabular-nums">{formatCentsAsBrl(gift.priceInCents)}</p>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-ink-soft">{gift.description}</p>

        <div className="mt-auto flex items-center justify-end gap-2 pt-3">
          <IconActionButton label="Editar presente" onClick={() => onEdit(gift)}>
            <Pencil className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </IconActionButton>
          <IconActionButton
            label={gift.isActive ? "Ocultar da lista" : "Mostrar na lista"}
            onClick={() => onToggleVisibility(gift)}
            disabled={isUpdatingVisibility}
          >
            {gift.isActive ? (
              <EyeOff className="size-4" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Eye className="size-4" strokeWidth={1.5} aria-hidden="true" />
            )}
          </IconActionButton>
          <IconActionButton label="Excluir presente" tone="danger" onClick={() => onRequestDelete(gift)}>
            <Trash2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </IconActionButton>
        </div>
      </div>
    </li>
  );
}
