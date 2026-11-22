<script lang="ts">
  import CiChevronLeftSmall from "../../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../../icons/ui/CiChevronRightSmall.svelte";
  import CiEndLeftSmall from "../../icons/ui/CiEndLeftSmall.svelte";
  import CiEndRightSmall from "../../icons/ui/CiEndRightSmall.svelte";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    count: number;
    page?: number;
    rowsPerPage?: number;
    rowsPerPageOptions?: number[];
    onPageChange?: (newPage: number) => void;
    onRowsPerPageChange?: (newRowsPerPage: number) => void;
    labelRowsPerPage?: string;
    labelDisplayedRows?: (info: { from: number; to: number; count: number }) => string;
    showFirstButton?: boolean;
    showLastButton?: boolean;
    centered?: boolean;
    class?: string;
  }

  let {
    count,
    page = $bindable(0),
    rowsPerPage = $bindable(10),
    rowsPerPageOptions = [5, 10, 25],
    onPageChange,
    onRowsPerPageChange,
    labelRowsPerPage = "Rows per page:",
    labelDisplayedRows,
    showFirstButton = false,
    showLastButton = false,
    centered = false,
    class: className = "",
  }: Props = $props();

  const uid = $props.id();
  const selectId = `coim-table-pagination-select-${uid}`;

  const totalPages = $derived(Math.max(1, Math.ceil(count / Math.max(1, rowsPerPage))));
  const from = $derived(count === 0 ? 0 : page * rowsPerPage + 1);
  const to = $derived(
    count === 0 ? 0 : Math.min(count, (page + 1) * rowsPerPage),
  );

  const displayedText = $derived.by(() => {
    if (labelDisplayedRows) {
      return labelDisplayedRows({ from, to, count });
    }
    return `${from}–${to} of ${count}`;
  });

  function goToPage(nextPage: number) {
    const clamped = Math.max(0, Math.min(totalPages - 1, nextPage));
    if (clamped === page) return;
    page = clamped;
    onPageChange?.(clamped);
  }

  function handleSelectChange(event: Event) {
    const nextSize = parseInt((event.currentTarget as HTMLSelectElement).value, 10);
    if (Number.isNaN(nextSize)) return;
    rowsPerPage = nextSize;
    page = 0;
    onRowsPerPageChange?.(nextSize);
    onPageChange?.(0);
  }
</script>

<div
  class={cn(
    "coim-table-pagination",
    centered && "coim-table-pagination-centered",
    className,
  )}
>
  {#if rowsPerPageOptions.length > 0}
    <div class="inline-flex items-center gap-2">
      <label for={selectId} class="text-text-secondary text-base">
        {labelRowsPerPage}
      </label>
      <select
        id={selectId}
        class="coim-table-pagination-select"
        value={String(rowsPerPage)}
        onchange={handleSelectChange}
      >
        {#each rowsPerPageOptions as option (option)}
          <option value={String(option)}>{option}</option>
        {/each}
      </select>
    </div>
  {/if}

  <span class="text-text-primary text-base">{displayedText}</span>

  <div class="coim-table-pagination-actions">
    {#if showFirstButton}
      <button
        type="button"
        aria-label="Go to first page"
        disabled={page <= 0}
        onclick={() => goToPage(0)}
        class="hover:bg-primary/10 hover:text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-inherit disabled:pointer-events-none disabled:opacity-50"
      >
        <CiEndLeftSmall size="medium" class="rtl:rotate-180" aria-hidden="true" />
      </button>
    {/if}

    <button
      type="button"
      aria-label="Go to previous page"
      disabled={page <= 0}
      onclick={() => goToPage(page - 1)}
      class="hover:bg-primary/10 hover:text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-inherit disabled:pointer-events-none disabled:opacity-50"
    >
      <CiChevronLeftSmall size="medium" class="rtl:rotate-180" aria-hidden="true" />
    </button>

    <button
      type="button"
      aria-label="Go to next page"
      disabled={count === 0 || page >= totalPages - 1}
      onclick={() => goToPage(page + 1)}
      class="hover:bg-primary/10 hover:text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-inherit disabled:pointer-events-none disabled:opacity-50"
    >
      <CiChevronRightSmall size="medium" class="rtl:rotate-180" aria-hidden="true" />
    </button>

    {#if showLastButton}
      <button
        type="button"
        aria-label="Go to last page"
        disabled={count === 0 || page >= totalPages - 1}
        onclick={() => goToPage(totalPages - 1)}
        class="hover:bg-primary/10 hover:text-primary inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-inherit disabled:pointer-events-none disabled:opacity-50"
      >
        <CiEndRightSmall size="medium" class="rtl:rotate-180" aria-hidden="true" />
      </button>
    {/if}
  </div>
</div>
