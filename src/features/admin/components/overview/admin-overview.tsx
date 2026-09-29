import Link from "next/link";
import { ArrowUpRight, CalendarClock, Gift, Hourglass, MailOpen, Plus, UsersRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { BotanicalSprig } from "@/components/brand/botanical-sprig";
import { summarizeContributions, type GiftContributionRecord } from "@/features/gifts/domain/gift-contribution";
import { formatCentsAsBrl } from "@/features/gifts/domain/money";
import {
  formatGreetingLine,
  summarizeRsvp,
  type InvitationRecord,
} from "@/features/invitation/domain/invitation-record";
import { ADMIN_ROUTES } from "@/lib/routes";
import { formatAdminDateTime, pluralize } from "../../domain/admin-formatters";
import { AdminPageHeader } from "../ui/admin-page-header";
import { AdminSurface } from "../ui/admin-surface";
import { EmptyState } from "../ui/empty-state";
import { StatCard } from "../ui/stat-card";
import { CONTRIBUTION_BADGES, RSVP_BADGES, StatusBadge } from "../ui/status-badge";

interface AdminOverviewProps {
  readonly graduateName: string;
  readonly invitations: readonly InvitationRecord[];
  readonly contributions: readonly GiftContributionRecord[];
  readonly activeGiftCount: number;
}

const RECENT_ITEMS_LIMIT = 5;

function SectionTitle({ title, href, linkLabel }: { readonly title: string; readonly href: string; readonly linkLabel: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-5 pt-5 sm:px-6">
      <h2 className="font-serif text-xl text-forest">{title}</h2>
      <Link href={href} className="inline-flex items-center gap-1 text-sm text-ink-soft transition-colors hover:text-forest">
        {linkLabel}
        <ArrowUpRight className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function AdminOverview({ graduateName, invitations, contributions, activeGiftCount }: AdminOverviewProps) {
  const rsvpSummary = summarizeRsvp(invitations);
  const contributionTotals = summarizeContributions(contributions);

  const recentAnswers = invitations
    .filter((invitation): invitation is InvitationRecord & { respondedAt: string } => invitation.respondedAt !== null)
    .toSorted((first, second) => second.respondedAt.localeCompare(first.respondedAt))
    .slice(0, RECENT_ITEMS_LIMIT);

  const recentContributions = contributions
    .filter((contribution) => contribution.status !== "cancelled")
    .slice(0, RECENT_ITEMS_LIMIT);

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <AdminPageHeader
        eyebrow="Visão geral"
        title="Bom te ver,"
        highlightedTitle={`${graduateName}.`}
        description="Um resumo de quem já recebeu o convite, quem confirmou presença e do carinho que chegou em forma de presente."
        actions={
          <>
            <ButtonLink href={ADMIN_ROUTES.invitations} size="sm" leadingIcon={<Plus className="size-4" aria-hidden="true" />}>
              Criar convite
            </ButtonLink>
            <ButtonLink href={ADMIN_ROUTES.gifts} size="sm" variant="secondary" leadingIcon={<Gift className="size-4" strokeWidth={1.5} aria-hidden="true" />}>
              Lista de presentes
            </ButtonLink>
          </>
        }
      />

      <section aria-labelledby="guests-summary-title" className="flex flex-col gap-4">
        <h2 id="guests-summary-title" className="text-[0.68rem] uppercase tracking-[0.32em] text-gold">
          Convidados
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Convites criados"
            value={String(rsvpSummary.totalInvitations)}
            hint={`${pluralize(rsvpSummary.openedInvitations, "já foi aberto", "já foram abertos")}`}
            icon={MailOpen}
          />
          <StatCard
            label="Presenças confirmadas"
            value={pluralize(rsvpSummary.confirmedGuests, "pessoa", "pessoas")}
            hint={`Em ${pluralize(rsvpSummary.confirmedInvitations, "convite", "convites")}`}
            icon={UsersRound}
            tone="forest"
          />
          <StatCard
            label="Confirmar depois"
            value={String(rsvpSummary.deferredInvitations)}
            hint="Vale um lembrete carinhoso"
            icon={CalendarClock}
            tone="gold"
          />
          <StatCard
            label="Aguardando resposta"
            value={String(rsvpSummary.pendingInvitations)}
            hint="Ainda não responderam"
            icon={Hourglass}
          />
        </div>
      </section>

      <section aria-labelledby="gifts-summary-title" className="flex flex-col gap-4">
        <h2 id="gifts-summary-title" className="text-[0.68rem] uppercase tracking-[0.32em] text-gold">
          Presentes
        </h2>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
          <article className="relative overflow-hidden rounded-lg bg-forest-deep p-6 text-paper shadow-[0_30px_60px_-36px_rgba(21,51,38,0.9)]">
            <BotanicalSprig className="pointer-events-none absolute -right-6 -top-4 w-32 rotate-[25deg] opacity-20" />
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold-soft">Total recebido</p>
            <p className="mt-3 font-serif text-4xl tabular-nums sm:text-5xl">{formatCentsAsBrl(contributionTotals.confirmedInCents)}</p>
            <p className="mt-3 text-sm text-paper/70">
              {pluralize(contributionTotals.confirmedCount, "presente confirmado", "presentes confirmados")} por você
            </p>
          </article>
          <StatCard
            label="Pix informados"
            value={formatCentsAsBrl(contributionTotals.reportedInCents)}
            hint={`${pluralize(contributionTotals.reportedCount, "aviso", "avisos")} para conferir no banco`}
            icon={Gift}
            tone="gold"
          />
          <StatCard
            label="Na lista agora"
            value={pluralize(activeGiftCount, "presente", "presentes")}
            hint={`${pluralize(contributionTotals.awaitingCount, "Pix gerado", "Pix gerados")} sem aviso de pagamento`}
            icon={Gift}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminSurface>
          <SectionTitle title="Últimas respostas" href={ADMIN_ROUTES.invitations} linkLabel="Ver convites" />
          {recentAnswers.length === 0 ? (
            <EmptyState title="Nenhuma resposta ainda" description="Assim que alguém confirmar presença, aparece aqui." />
          ) : (
            <ul className="mt-3 divide-y divide-gold-soft/40 px-5 pb-3 sm:px-6">
              {recentAnswers.map((invitation) => (
                <li key={invitation.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-[1.02rem] text-forest">
                      {formatGreetingLine(invitation.greetingPrefix, invitation.greetingName)}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-soft">{formatAdminDateTime(invitation.respondedAt)}</p>
                  </div>
                  <StatusBadge {...RSVP_BADGES[invitation.rsvpStatus]} />
                </li>
              ))}
            </ul>
          )}
        </AdminSurface>

        <AdminSurface>
          <SectionTitle title="Últimos presentes" href={ADMIN_ROUTES.contributions} linkLabel="Ver recebidos" />
          {recentContributions.length === 0 ? (
            <EmptyState title="Nenhum presente ainda" description="Quando alguém gerar um Pix de presente, você vê aqui." />
          ) : (
            <ul className="mt-3 divide-y divide-gold-soft/40 px-5 pb-3 sm:px-6">
              {recentContributions.map((contribution) => (
                <li key={contribution.id} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate font-serif text-[1.02rem] text-forest">{contribution.giverName}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {formatCentsAsBrl(contribution.totalInCents)} • {formatAdminDateTime(contribution.createdAt)}
                    </p>
                  </div>
                  <StatusBadge {...CONTRIBUTION_BADGES[contribution.status]} />
                </li>
              ))}
            </ul>
          )}
        </AdminSurface>
      </div>
    </div>
  );
}
