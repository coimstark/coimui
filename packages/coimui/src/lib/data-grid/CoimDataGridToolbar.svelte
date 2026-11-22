<script lang="ts">
  import type { Snippet } from "svelte";
  import CiDownloadCloud from "../icons/ui/CiDownloadCloud.svelte";
  import CiEyeOpen from "../icons/ui/CiEyeOpen.svelte";
  import CiPrinter from "../icons/ui/CiPrinter.svelte";
  import CiSearch from "../icons/ui/CiSearch.svelte";
  import type { CoimDataGridColumn, CoimDataGridDensity } from "./types.js";

  interface Props {
    globalFilter?: string;
    density?: CoimDataGridDensity;
    columns?: CoimDataGridColumn<Record<string, unknown>>[];
    columnVisibility?: Record<string, boolean>;
    groupable?: boolean;
    grouping?: string[];
    enableExport?: boolean;
    onGlobalFilterChange?: (value: string) => void;
    onDensityChange?: (density: CoimDataGridDensity) => void;
    onColumnVisibilityToggle?: (columnId: string) => void;
    onGroupingChange?: (grouping: string[]) => void;
    onExportCsv?: () => void;
    onExportExcel?: () => void;
    onPrint?: () => void;
    actions?: Snippet;
  }

  let {
    globalFilter = $bindable(""),
    density = $bindable<CoimDataGridDensity>("standard"),
    columns = [],
    columnVisibility = {},
    groupable = false,
    grouping = [],
    enableExport = true,
    onGlobalFilterChange,
    onDensityChange,
    onColumnVisibilityToggle,
    onGroupingChange,
    onExportCsv,
    onExportExcel,
    onPrint,
    actions,
  }: Props = $props();

  let columnsOpen = $state(false);
</script>

<div class="coim-data-grid-toolbar">
  <div class="flex flex-wrap items-center gap-2">
    <label class="border-grey-200 bg-background-paper flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm">
      <CiSearch size="small" class="text-text-secondary shrink-0" />
      <input
        type="search"
        value={globalFilter}
        placeholder="Search..."
        aria-label="Search rows"
        class="bg-transparent text-sm outline-none"
        oninput={(e) => {
          const val = (e.currentTarget as HTMLInputElement).value;
          globalFilter = val;
          onGlobalFilterChange?.(val);
        }}
      />
    </label>

    {#if groupable}
      <label class="flex items-center gap-1.5 text-sm">
        <span class="text-text-secondary">Group:</span>
        <select
          aria-label="Group by column"
          value={grouping[0] ?? ""}
          class="border-grey-200 bg-background-paper rounded-md border px-2 py-1 text-sm"
          onchange={(e) => {
            const val = (e.currentTarget as HTMLSelectElement).value;
            onGroupingChange?.(val ? [val] : []);
          }}
        >
          <option value="">None</option>
          {#each columns.filter((c) => c.groupable !== false && c.type !== "actions") as col (col.id)}
            <option value={col.id}>{col.headerName}</option>
          {/each}
        </select>
      </label>
    {/if}
  </div>

  <div class="flex flex-wrap items-center gap-2">
    {#if actions}
      {@render actions()}
    {/if}

    <div class="relative">
      <button
        type="button"
        aria-expanded={columnsOpen}
        class="border-grey-200 hover:bg-grey-25 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={() => {
          columnsOpen = !columnsOpen;
        }}
      >
        <CiEyeOpen size="small" />
        <span>Columns</span>
      </button>

      {#if columnsOpen}
        <div
          role="group"
          aria-label="Toggle columns"
          class="bg-background-paper border-grey-100 shadow-darker-sm absolute end-0 top-full z-20 mt-1 min-w-44 rounded-md border p-2"
        >
          {#each columns.filter((c) => c.hideable !== false) as col (col.id)}
            {@const visible = columnVisibility[col.id] !== false}
            <label class="hover:bg-grey-25 flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm">
              <input
                type="checkbox"
                checked={visible}
                onchange={() => onColumnVisibilityToggle?.(col.id)}
              />
              <span>{col.headerName}</span>
            </label>
          {/each}
        </div>
      {/if}
    </div>

    <select
      aria-label="Row density"
      value={density}
      class="border-grey-200 bg-background-paper rounded-md border px-2 py-1.5 text-sm"
      onchange={(e) => {
        const next = (e.currentTarget as HTMLSelectElement).value as CoimDataGridDensity;
        density = next;
        onDensityChange?.(next);
      }}
    >
      <option value="compact">Compact</option>
      <option value="standard">Standard</option>
      <option value="comfortable">Comfortable</option>
    </select>

    {#if enableExport}
      <button
        type="button"
        class="border-grey-200 hover:bg-grey-25 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={onExportCsv}
      >
        <CiDownloadCloud size="small" />
        <span>CSV</span>
      </button>
      <button
        type="button"
        class="border-grey-200 hover:bg-grey-25 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={onExportExcel}
      >
        <CiDownloadCloud size="small" />
        <span>Excel</span>
      </button>
      <button
        type="button"
        class="border-grey-200 hover:bg-grey-25 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={onPrint}
      >
        <CiPrinter size="small" />
        <span>Print</span>
      </button>
    {/if}
  </div>
</div>
