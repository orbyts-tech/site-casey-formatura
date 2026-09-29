"use client";

import { Eye, EyeOff, Search, Trash2 } from "lucide-react";
import { formatGreetingLine, type InvitationRecord } from "@/features/invitation/domain/invitation-record";
import { deleteInvitationAction } from "../../actions/invitation-admin-actions";
import { formatAdminDate, formatAdminDateTime } from "../../domain/admin-formatters";
import { buildInvitationLink } from "../../domain/invitation-share";
import { useDeleteConfirmation } from "../../hooks/use-delete-confirmation";
import { useInvitationFilters } from "../../hooks/use-invitation-filters";
import { AdminSurface } from "../ui/admin-surface";
import { ConfirmDialog } from "../ui/confirm-dialog";
import { EmptyState } from "../ui/empty-state";
import { IconActionButton } from "../ui/icon-action";
import { SegmentedFilter } from "../ui/segmented-filter";
import { RSVP_BADGES, StatusBadge } from "../ui/status-badge";
import { InvitationShareIconActions } from "./invitation-share-actions";

interface InvitationListProps {
  readonly invitations: readonly InvitationRecord[];
  readonly siteOrigin: string;
  readonly graduateName: string;
}

interface InvitationRowProps {
  readonly invitation: InvitationRecord;
  readonly siteOrigin: string;
  readonly graduateName: string;
  readonly onRequestDelete: (invitation: InvitationRecord) => void;
}

function InvitationRow({ invitation, siteOrigin, graduateName, onRequestDelete }: InvitationRowProps) {
  const greetingLine = formatGreetingLine(invitation.greetingPrefix, invitation.greetingName);
  const hasOpened = invitation.openedAt !== null;

  return (
    <li className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <p className="font-serif text-lg text-forest">{greetingLine}</p>
          <StatusBadge {...RSVP_BADGES[invitation.rsvpStatus]} />
        </div>
        {invitation.guestNames.length > 0 && (
          <p className="mt-1 text-sm text-ink">{invitation.guestNames.join(" • ")}</p>
        )}
        <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
          <span>Criado em {formatAdminDate(invitation.createdAt)}</span>
          <span className="inline-flex items-center gap-1">
            {hasOpened ? (
              <Eye className="size-3.5 text-forest" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <EyeOff className="size-3.5" strokeWidth={1.5} aria-hidden="true" />
            )}
            {invitation.openedAt ? `Abriu em ${formatAdminDateTime(invitation.openedAt)}` : "Ainda não abriu"}
          </span>
          {invitation.respondedAt && <span>Respondeu em {formatAdminDateTime(invitation.respondedAt)}</span>}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <InvitationShareIconActions
          greetingLine={greetingLine}
          invitationLink={buildInvitationLink(siteOrigin, invitation.token)}
          graduateName={graduateName}
        />
        <IconActionButton label="Excluir convite" tone="danger" onClick={() => onRequestDelete(invitation)}>
          <Trash2 className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </IconActionButton>
      </div>
    </li>
  );
}

export function InvitationList({ invitations, siteOrigin, graduateName }: InvitationListProps) {
  const { statusFilter, setStatusFilter, searchText, setSearchText, filterOptions, visibleInvitations } =
    useInvitationFilters(invitations);
  const { pendingItem, isDeleting, errorMessage, requestDelete, cancelDelete, confirmDelete } =
    useDeleteConfirmation<InvitationRecord>(deleteInvitationAction);

  const hasAnyInvitation = invitations.length > 0;

  return (
    <AdminSurface className="p-5 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-serif text-2xl text-forest">Convites enviados</h2>
          <label className="relative block sm:w-64">
            <span className="sr-only">Buscar convite</span>
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
        <SegmentedFilter label="Filtrar por resposta" options={filterOptions} selectedValue={statusFilter} onChange={setStatusFilter} />
      </div>

      {!hasAnyInvitation ? (
        <EmptyState title="Nenhum convite ainda" description="Crie o primeiro convite ao lado e envie o link para quem você ama." />
      ) : visibleInvitations.length === 0 ? (
        <EmptyState title="Nada por aqui" description="Nenhum convite corresponde a este filtro ou busca." />
      ) : (
        <ul className="mt-2 divide-y divide-gold-soft/40">
          {visibleInvitations.map((invitation) => (
            <InvitationRow
              key={invitation.id}
              invitation={invitation}
              siteOrigin={siteOrigin}
              graduateName={graduateName}
              onRequestDelete={requestDelete}
            />
          ))}
        </ul>
      )}

      <ConfirmDialog
        isOpen={pendingItem !== null}
        title="Excluir este convite?"
        description={
          pendingItem
            ? `O link de "${formatGreetingLine(pendingItem.greetingPrefix, pendingItem.greetingName)}" deixará de funcionar e a resposta será apagada.`
            : ""
        }
        confirmLabel="Excluir convite"
        isConfirming={isDeleting}
        errorMessage={errorMessage}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </AdminSurface>
  );
}
