"use client";

import { useState } from "react";
import { BadgeCheck, Hourglass, Search, Wallet } from "lucide-react";
import { summarizeContributions } from "@/features/gifts/domain/gift-contribution";
import { formatCentsAsBrl } from "@/features/gifts/domain/money";
import { confirmContributionAction } from "../../actions/contribution-admin-actions";
import { pluralize } from "../../domain/admin-formatters";
import type { ContributionListItem } from "../../domain/contribution-list-item";
import { useAdminMutation } from "../../hooks/use-admin-mutation";
import { useContributionFilters } from "../../hooks/use-contribution-filters";
import { AdminPageHeader } from "../ui/admin-page-header";
import { AdminSurface } from "../ui/admin-surface";
import { EmptyState } from "../ui/empty-state";
import { SegmentedFilter } from "../ui/segmented-filter";
import { StatCard } from "../ui/stat-card";
import { ContributionCard } from "./contribution-card";

interface ContributionsScreenProps {
  readonly contributions: readonly ContributionListItem[];
}

export function ContributionsScreen({ contributions }: ContributionsScreenProps) {
  const totals = summarizeContributions(contributions);
  const { statusFilter, setStatusFilter, searchText, setSearchText, filterOptions, visibleContributions } =
    useContributionFilters(contributions);
  const [confirmingContributionId, setConfirmingContributionId] = useState<string | null>(null);
  const { errorMessage, run: runConfirmContribution } = useAdminMutation(confirmContributionAction);

  const confirmContribution = async (contributionId: string) => {
    setConfirmingContributionId(contributionId);
    await runConfirmContribution(contributionId);
    setConfirmingContributionId(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        eyebrow="Presentes recebidos"
        title="Todo esse"
        highlightedTitle="carinho."
        description="Quem presenteou, o que escolheu e as mensagens deixadas para você. Confira no extrato do banco e marque cada Pix como recebido."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total recebido"
          value={formatCentsAsBrl(totals.confirmedInCents)}
          hint={pluralize(totals.confirmedCount, "presente confirmado", "presentes confirmados")}
          icon={BadgeCheck}
          tone="forest"
        />
        <StatCard
          label="Para conferir"
          value={formatCentsAsBrl(totals.reportedInCents)}
          hint={`${pluralize(totals.reportedCount, "convidado avisou", "convidados avisaram")} que pagou`}
          icon={Wallet}
          tone="gold"
        />
        <StatCard
          label="Pix gerados"
          value={formatCentsAsBrl(totals.awaitingInCents)}
          hint={`${totals.awaitingCount} Pix sem aviso de pagamento`}
          icon={Hourglass}
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SegmentedFilter label="Filtrar por situação" options={filterOptions} selectedValue={statusFilter} onChange={setStatusFilter} />
        <label className="relative block lg:w-64">
          <span className="sr-only">Buscar por nome</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-soft" strokeWidth={1.5} aria-hidden="true" />
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Buscar por nome"
            className="w-full rounded-full border border-gold-soft/70 bg-paper py-2 pl-10 pr-4 text-sm text-ink placeholder:text-ink-soft/70 focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
          />
        </label>
      </div>

      {errorMessage && (
        <p role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {visibleContributions.length === 0 ? (
        <AdminSurface>
          <EmptyState
            title={contributions.length === 0 ? "Nenhum presente ainda" : "Nada por aqui"}
            description={
              contributions.length === 0
                ? "Quando alguém escolher um presente e gerar o Pix, ele aparece aqui com a mensagem."
                : "Nenhum presente corresponde a este filtro ou busca."
            }
          />
        </AdminSurface>
      ) : (
        <ul className="flex flex-col gap-4">
          {visibleContributions.map((contribution) => (
            <ContributionCard
              key={contribution.id}
              contribution={contribution}
              isConfirming={confirmingContributionId === contribution.id}
              onConfirm={confirmContribution}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
