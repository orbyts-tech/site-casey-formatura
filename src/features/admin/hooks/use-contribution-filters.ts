"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { GiftContributionStatus } from "@/features/gifts/domain/gift-contribution";
import { normalizeForSearch } from "../domain/admin-formatters";
import type { ContributionListItem } from "../domain/contribution-list-item";
import type { SegmentedFilterOption } from "../components/ui/segmented-filter";

export type ContributionStatusFilter = "all" | Exclude<GiftContributionStatus, "cancelled">;

const FILTER_DEFINITIONS: readonly { readonly value: ContributionStatusFilter; readonly label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "reported_paid", label: "Para conferir" },
  { value: "confirmed", label: "Recebidos" },
  { value: "awaiting_payment", label: "Pix gerados" },
];

const matchesStatusFilter = (contribution: ContributionListItem, statusFilter: ContributionStatusFilter): boolean =>
  statusFilter === "all" ? contribution.status !== "cancelled" : contribution.status === statusFilter;

export function useContributionFilters(contributions: readonly ContributionListItem[]) {
  const [statusFilter, setStatusFilter] = useState<ContributionStatusFilter>("all");
  const [searchText, setSearchText] = useState("");
  const deferredSearchText = useDeferredValue(searchText);

  const filterOptions = useMemo<readonly SegmentedFilterOption<ContributionStatusFilter>[]>(
    () =>
      FILTER_DEFINITIONS.map(({ value, label }) => ({
        value,
        label,
        count: contributions.filter((contribution) => matchesStatusFilter(contribution, value)).length,
      })),
    [contributions],
  );

  const visibleContributions = useMemo(() => {
    const normalizedSearch = normalizeForSearch(deferredSearchText);
    return contributions.filter((contribution) => {
      const searchableText = normalizeForSearch(`${contribution.giverName} ${contribution.invitationLabel ?? ""}`);
      return (
        matchesStatusFilter(contribution, statusFilter) &&
        (normalizedSearch.length === 0 || searchableText.includes(normalizedSearch))
      );
    });
  }, [contributions, statusFilter, deferredSearchText]);

  return { statusFilter, setStatusFilter, searchText, setSearchText, filterOptions, visibleContributions };
}
