"use client";

import { CheckCheck, LoaderCircle, Mail, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCentsAsBrl } from "@/features/gifts/domain/money";
import { formatAdminDateTime } from "../../domain/admin-formatters";
import type { ContributionListItem } from "../../domain/contribution-list-item";
import { ADMIN_SURFACE_CLASSES } from "../ui/admin-surface";
import { CONTRIBUTION_BADGES, StatusBadge } from "../ui/status-badge";

interface ContributionCardProps {
  readonly contribution: ContributionListItem;
  readonly isConfirming: boolean;
  readonly onConfirm: (contributionId: string) => void;
}

export function ContributionCard({ contribution, isConfirming, onConfirm }: ContributionCardProps) {
  const canConfirm = contribution.status === "awaiting_payment" || contribution.status === "reported_paid";

  return (
    <li className={`${ADMIN_SURFACE_CLASSES} flex flex-col gap-4 p-5 sm:p-6`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <p className="font-serif text-xl text-forest">{contribution.giverName}</p>
            <StatusBadge {...CONTRIBUTION_BADGES[contribution.status]} />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
            <span>Pix gerado em {formatAdminDateTime(contribution.createdAt)}</span>
            {contribution.reportedPaidAt && <span>Avisou em {formatAdminDateTime(contribution.reportedPaidAt)}</span>}
            {contribution.confirmedAt && <span>Confirmado em {formatAdminDateTime(contribution.confirmedAt)}</span>}
          </p>
          {contribution.invitationLabel && (
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-forest">
              <Mail className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
              Convite: {contribution.invitationLabel}
            </p>
          )}
        </div>
        <p className="shrink-0 font-serif text-2xl text-forest tabular-nums sm:text-right">
          {formatCentsAsBrl(contribution.totalInCents)}
        </p>
      </div>

      <ul className="flex flex-wrap gap-2">
        {contribution.items.map((item) => (
          <li key={item.giftId} className="rounded-full border border-gold-soft/60 bg-ivory px-3 py-1 text-xs text-ink">
            {item.quantity}× {item.giftName}
            <span className="text-ink-soft"> • {formatCentsAsBrl(item.unitPriceInCents * item.quantity)}</span>
          </li>
        ))}
      </ul>

      {contribution.message && (
        <blockquote className="relative rounded-md bg-sage/35 px-5 py-4 pl-11">
          <Quote className="absolute left-4 top-4 size-4 text-gold" strokeWidth={1.5} aria-hidden="true" />
          <p className="font-serif text-[1.02rem] italic leading-relaxed text-ink">{contribution.message}</p>
        </blockquote>
      )}

      <div className="flex flex-col gap-3 border-t border-gold-soft/40 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-[0.7rem] text-ink-soft">
          Identificador do Pix: <span className="text-ink">{contribution.pixTransactionId}</span>
        </p>
        {canConfirm && (
          <Button
            size="sm"
            variant={contribution.status === "reported_paid" ? "primary" : "secondary"}
            disabled={isConfirming}
            onClick={() => onConfirm(contribution.id)}
            leadingIcon={
              isConfirming ? (
                <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <CheckCheck className="size-4" strokeWidth={1.5} aria-hidden="true" />
              )
            }
          >
            Marcar como recebido
          </Button>
        )}
      </div>
    </li>
  );
}
