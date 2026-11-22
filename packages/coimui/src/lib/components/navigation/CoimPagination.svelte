<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import CiChevronLeftSmall from "../../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../../icons/ui/CiChevronRightSmall.svelte";
  import CiEndLeftSmall from "../../icons/ui/CiEndLeftSmall.svelte";
  import CiEndRightSmall from "../../icons/ui/CiEndRightSmall.svelte";
  import { cn } from "../../utilities/utils.js";
  import type {
    CoimPaginationColor,
    CoimPaginationShape,
    CoimPaginationSize,
    CoimPaginationVariant,
  } from "./types.js";

  type PaginationEntry =
    | { type: "first" | "previous" | "next" | "last"; key: string }
    | { type: "start-ellipsis" | "end-ellipsis"; key: string }
    | { type: "page"; page: number; key: string };

  interface Props extends Omit<HTMLAttributes<HTMLElement>, "class" | "children"> {
    count: number;
    page?: number;
    siblingCount?: number;
    boundaryCount?: number;
    showFirstButton?: boolean;
    showLastButton?: boolean;
    hidePrevButton?: boolean;
    hideNextButton?: boolean;
    size?: CoimPaginationSize;
    variant?: CoimPaginationVariant;
    color?: CoimPaginationColor;
    shape?: CoimPaginationShape;
    disabled?: boolean;
    ariaLabel?: string;
    onChange?: (page: number) => void;
    class?: string;
  }

  let {
    count,
    page = $bindable(1),
    siblingCount = 1,
    boundaryCount = 1,
    showFirstButton = false,
    showLastButton = false,
    hidePrevButton = false,
    hideNextButton = false,
    size = "medium",
    variant = "text",
    color = "primary",
    shape = "rounded",
    disabled = false,
    ariaLabel = "Pagination navigation",
    onChange,
    class: className = "",
    ...rest
  }: Props = $props();

  const safeCount = $derived(Math.max(0, Math.floor(count)));
  const currentPage = $derived(safeCount === 0 ? 0 : Math.min(Math.max(1, Math.floor(page)), safeCount));

  function range(start: number, end: number): number[] {
    if (end < start) return [];
    const out: number[] = [];
    for (let i = start; i <= end; i += 1) out.push(i);
    return out;
  }

  const entries = $derived.by<PaginationEntry[]>(() => {
    if (safeCount <= 0) return [];

    const startPages = range(1, Math.min(boundaryCount, safeCount));
    const endPages = range(
      Math.max(safeCount - boundaryCount + 1, boundaryCount + 1),
      safeCount,
    );

    const siblingsStart = Math.max(
      Math.min(currentPage - siblingCount, safeCount - boundaryCount - siblingCount * 2 - 1),
      boundaryCount + 2,
    );
    const siblingsEnd = Math.min(
      Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : safeCount - 1,
    );

    const list: PaginationEntry[] = [];

    if (showFirstButton) list.push({ type: "first", key: "first" });
    if (!hidePrevButton) list.push({ type: "previous", key: "previous" });

    for (const p of startPages) {
      list.push({ type: "page", page: p, key: `p-${p}` });
    }

    if (siblingsStart > boundaryCount + 2) {
      list.push({ type: "start-ellipsis", key: "start-ellipsis" });
    } else if (boundaryCount + 1 < safeCount - boundaryCount) {
      list.push({ type: "page", page: boundaryCount + 1, key: `p-${boundaryCount + 1}` });
    }

    for (const p of range(siblingsStart, siblingsEnd)) {
      list.push({ type: "page", page: p, key: `p-${p}` });
    }

    if (siblingsEnd < safeCount - boundaryCount - 1) {
      list.push({ type: "end-ellipsis", key: "end-ellipsis" });
    } else if (safeCount - boundaryCount > boundaryCount) {
      const p = safeCount - boundaryCount;
      if (!endPages.includes(p) && p > siblingsEnd) {
        list.push({ type: "page", page: p, key: `p-${p}` });
      }
    }

    for (const p of endPages) {
      list.push({ type: "page", page: p, key: `p-${p}` });
    }

    if (!hideNextButton) list.push({ type: "next", key: "next" });
    if (showLastButton) list.push({ type: "last", key: "last" });

    return list;
  });

  function goToPage(target: number) {
    if (disabled || safeCount <= 0) return;
    const clamped = Math.min(Math.max(1, target), safeCount);
    if (clamped === page) return;
    page = clamped;
    onChange?.(clamped);
  }
</script>

<nav
  aria-label={ariaLabel}
  class={cn(
    "coim-pagination",
    `coim-pagination-variant-${variant}`,
    `coim-pagination-color-${color}`,
    className,
  )}
  {...rest}
>
  <ul class="coim-pagination-list">
    {#each entries as entry (entry.key)}
      <li>
        {#if entry.type === "start-ellipsis" || entry.type === "end-ellipsis"}
          <span class="coim-pagination-ellipsis" aria-hidden="true">…</span>
        {:else if entry.type === "page"}
          {@const selected = entry.page === currentPage}
          <button
            type="button"
            disabled={disabled}
            aria-label={`Page ${entry.page}`}
            aria-current={selected ? "page" : undefined}
            class={cn(
              "coim-pagination-item",
              `coim-pagination-size-${size}`,
              `coim-pagination-shape-${shape}`,
              selected && "is-selected",
              disabled && "is-disabled",
            )}
            onclick={() => goToPage(entry.page)}
          >
            {entry.page}
          </button>
        {:else}
          {@const targetPage =
            entry.type === "first"
              ? 1
              : entry.type === "last"
                ? safeCount
                : entry.type === "previous"
                  ? currentPage - 1
                  : currentPage + 1}
          {@const btnDisabled =
            disabled ||
            safeCount === 0 ||
            ((entry.type === "first" || entry.type === "previous") && currentPage <= 1) ||
            ((entry.type === "last" || entry.type === "next") && currentPage >= safeCount)}
          {@const btnLabel =
            entry.type === "first"
              ? "Go to first page"
              : entry.type === "last"
                ? "Go to last page"
                : entry.type === "previous"
                  ? "Go to previous page"
                  : "Go to next page"}
          <button
            type="button"
            disabled={btnDisabled}
            aria-label={btnLabel}
            class={cn(
              "coim-pagination-item",
              `coim-pagination-size-${size}`,
              `coim-pagination-shape-${shape}`,
              btnDisabled && "is-disabled",
            )}
            onclick={() => goToPage(targetPage)}
          >
            {#if entry.type === "first"}
              <CiEndLeftSmall size="small" />
            {:else if entry.type === "previous"}
              <CiChevronLeftSmall size="small" />
            {:else if entry.type === "next"}
              <CiChevronRightSmall size="small" />
            {:else}
              <CiEndRightSmall size="small" />
            {/if}
          </button>
        {/if}
      </li>
    {/each}
  </ul>
</nav>
