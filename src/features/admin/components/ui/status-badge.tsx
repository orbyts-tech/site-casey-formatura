import type { GiftContributionStatus } from "@/features/gifts/domain/gift-contribution";
import type { InvitationRsvpStatus } from "@/features/invitation/domain/invitation-record";

type BadgeTone = "forest" | "gold" | "muted";

interface BadgeDefinition {
  readonly label: string;
  readonly tone: BadgeTone;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  forest: "border-forest/25 bg-forest/10 text-forest",
  gold: "border-gold/35 bg-gold-soft/30 text-[#7d6238]",
  muted: "border-ink-soft/20 bg-sage/50 text-ink-soft",
};

export const RSVP_BADGES: Readonly<Record<InvitationRsvpStatus, BadgeDefinition>> = {
  confirmed: { label: "Confirmado", tone: "forest" },
  deferred: { label: "Confirmar depois", tone: "gold" },
  pending: { label: "Aguardando", tone: "muted" },
};

export const CONTRIBUTION_BADGES: Readonly<Record<GiftContributionStatus, BadgeDefinition>> = {
  confirmed: { label: "Recebido", tone: "forest" },
  reported_paid: { label: "Pix informado", tone: "gold" },
  awaiting_payment: { label: "Pix gerado", tone: "muted" },
  cancelled: { label: "Cancelado", tone: "muted" },
};

export function StatusBadge({ label, tone }: BadgeDefinition) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[0.7rem] font-medium tracking-wide ${TONE_CLASSES[tone]}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
