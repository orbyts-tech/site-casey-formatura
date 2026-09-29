"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  formatGreetingLine,
  INVITATION_RSVP_STATUSES,
  type InvitationRecord,
  type InvitationRsvpStatus,
} from "@/features/invitation/domain/invitation-record";
import { normalizeForSearch } from "../domain/admin-formatters";
import type { SegmentedFilterOption } from "../components/ui/segmented-filter";

export type InvitationStatusFilter = "all" | InvitationRsvpStatus;

const FILTER_LABELS: Readonly<Record<InvitationStatusFilter, string>> = {
  all: "Todos",
  confirmed: "Confirmados",
  deferred: "Confirmar depois",
  pending: "Aguardando",
};

const buildSearchableText = (invitation: InvitationRecord): string =>
  normalizeForSearch(
    [formatGreetingLine(invitation.greetingPrefix, invitation.greetingName), ...invitation.guestNames].join(" "),
  );

export function useInvitationFilters(invitations: readonly InvitationRecord[]) {
  const [statusFilter, setStatusFilter] = useState<InvitationStatusFilter>("all");
  const [searchText, setSearchText] = useState("");
  const deferredSearchText = useDeferredValue(searchText);

  const filterOptions = useMemo<readonly SegmentedFilterOption<InvitationStatusFilter>[]>(
    () => [
      { value: "all", label: FILTER_LABELS.all, count: invitations.length },
      ...INVITATION_RSVP_STATUSES.map((status) => ({
        value: status,
        label: FILTER_LABELS[status],
        count: invitations.filter((invitation) => invitation.rsvpStatus === status).length,
      })),
    ],
    [invitations],
  );

  const visibleInvitations = useMemo(() => {
    const normalizedSearch = normalizeForSearch(deferredSearchText);
    return invitations.filter((invitation) => {
      const matchesStatus = statusFilter === "all" || invitation.rsvpStatus === statusFilter;
      const matchesSearch = normalizedSearch.length === 0 || buildSearchableText(invitation).includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [invitations, statusFilter, deferredSearchText]);

  return { statusFilter, setStatusFilter, searchText, setSearchText, filterOptions, visibleInvitations };
}
