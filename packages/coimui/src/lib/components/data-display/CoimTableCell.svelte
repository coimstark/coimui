<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLTdAttributes, HTMLThAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import {
    setTableCellSortContext,
    tryGetTableContext,
    tryGetTableSectionContext,
    type AriaSortDirection,
    type TablePadding,
    type TableSection,
    type TableSize,
  } from "./table-context.svelte.js";

  type CellAlign = "left" | "right" | "center" | "justify" | "inherit";
  type CellSortDirection = "asc" | "desc" | "ascending" | "descending" | false;

  interface Props {
    variant?: TableSection;
    component?: "th" | "td";
    scope?: "col" | "row" | "colgroup" | "rowgroup";
    align?: CellAlign;
    padding?: TablePadding;
    size?: TableSize;
    sortDirection?: CellSortDirection;
    colspan?: number;
    rowspan?: number;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    variant,
    component,
    scope,
    align = "inherit",
    padding,
    size,
    sortDirection,
    colspan,
    rowspan,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const tableCtx = tryGetTableContext();
  const sectionCtx = tryGetTableSectionContext();

  let childSortDirection = $state<AriaSortDirection | undefined>(undefined);

  setTableCellSortContext({
    setSortDirection: (dir) => {
      childSortDirection = dir;
    },
  });

  const resolvedVariant = $derived<TableSection>(variant ?? sectionCtx ?? "body");
  const tagName = $derived<"th" | "td">(
    component ?? (resolvedVariant === "head" ? "th" : "td"),
  );
  const resolvedScope = $derived(
    scope ?? (tagName === "th" ? (resolvedVariant === "head" ? "col" : "row") : undefined),
  );
  const resolvedSize = $derived<TableSize>(size ?? tableCtx?.size ?? "medium");
  const resolvedPadding = $derived<TablePadding>(padding ?? tableCtx?.padding ?? "normal");

  const resolvedAriaSort = $derived.by<AriaSortDirection | undefined>(() => {
    if (sortDirection === false) return undefined;
    if (sortDirection === "asc" || sortDirection === "ascending") return "ascending";
    if (sortDirection === "desc" || sortDirection === "descending") return "descending";
    if (sortDirection === undefined) return childSortDirection;
    return undefined;
  });

  const cellClasses = $derived(
    cn(
      "coim-table-cell",
      resolvedVariant === "head" && "coim-table-cell-head",
      resolvedSize === "small" && "coim-table-cell-small",
      resolvedPadding === "none" && "coim-table-cell-padding-none",
      resolvedPadding === "checkbox" && "coim-table-cell-padding-checkbox",
      align === "right" && "coim-table-cell-align-right",
      align === "center" && "coim-table-cell-align-center",
      align === "left" && "coim-table-cell-align-left",
      className,
    ),
  );
</script>

{#if tagName === "th"}
  <th
    {...(rest as HTMLThAttributes)}
    scope={resolvedScope}
    aria-sort={resolvedAriaSort}
    {colspan}
    {rowspan}
    class={cellClasses}
  >
    {@render children?.()}
  </th>
{:else}
  <td
    {...(rest as HTMLTdAttributes)}
    {colspan}
    {rowspan}
    class={cellClasses}
  >
    {@render children?.()}
  </td>
{/if}
