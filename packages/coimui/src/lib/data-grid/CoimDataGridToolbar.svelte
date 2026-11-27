<script lang="ts">
  import type { Snippet } from "svelte";
  import CiDownloadCloud from "../icons/ui/CiDownloadCloud.svelte";
  import CiEyeOpen from "../icons/ui/CiEyeOpen.svelte";
  import CiPivot from "../icons/ui/CiPivot.svelte";
  import CiPrinter from "../icons/ui/CiPrinter.svelte";
  import CiSearch from "../icons/ui/CiSearch.svelte";
  import CiSettings from "../icons/ui/CiSettings.svelte";
  import CiSparkle from "../icons/ui/CiSparkle.svelte";
  import type { TranslateFn } from "../layouts/types.js";
  import { resolveDataGridLabel } from "./i18n.js";
  import type { CoimDataGridColumn, CoimDataGridDensity } from "./types.js";

  interface Props {
    globalFilter?: string;
    density?: CoimDataGridDensity;
    columns?: CoimDataGridColumn<Record<string, unknown>>[];
    columnVisibility?: Record<string, boolean>;
    groupable?: boolean;
    grouping?: string[];
    pivotable?: boolean;
    pivotMode?: boolean;
    pivotPanelOpen?: boolean;
    aiAssistantEnabled?: boolean;
    aiAssistantOpen?: boolean;
    enableExport?: boolean;
    translate?: TranslateFn;
    onGlobalFilterChange?: (value: string) => void;
    onDensityChange?: (density: CoimDataGridDensity) => void;
    onColumnVisibilityToggle?: (columnId: string) => void;
    onGroupingChange?: (grouping: string[]) => void;
    onPivotToggle?: () => void;
    onPivotPanelToggle?: () => void;
    onAiAssistantToggle?: () => void;
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
    pivotable = false,
    pivotMode = false,
    pivotPanelOpen = false,
    aiAssistantEnabled = false,
    aiAssistantOpen = false,
    enableExport = true,
    translate,
    onGlobalFilterChange,
    onDensityChange,
    onColumnVisibilityToggle,
    onGroupingChange,
    onPivotToggle,
    onPivotPanelToggle,
    onAiAssistantToggle,
    onExportCsv,
    onExportExcel,
    onPrint,
    actions,
  }: Props = $props();

  let columnsOpen = $state(false);
  let columnsMenuEl = $state<HTMLDivElement | null>(null);

  $effect(() => {
    if (!columnsOpen || typeof window === "undefined") return;

    function handlePointerDown(event: PointerEvent) {
      if (columnsMenuEl && !columnsMenuEl.contains(event.target as Node)) {
        columnsOpen = false;
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        columnsOpen = false;
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
</script>

<div class="coim-data-grid-toolbar">
  <div class="flex flex-wrap items-center gap-2">
    <label class="border-grey-200 bg-background-paper flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-sm">
      <CiSearch size="small" class="text-text-secondary shrink-0" />
      <input
        type="search"
        value={globalFilter}
        placeholder={resolveDataGridLabel(translate, "data-grid-search-placeholder")}
        aria-label={resolveDataGridLabel(translate, "data-grid-search-aria-label")}
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
        <span class="text-text-secondary">
          {resolveDataGridLabel(translate, "data-grid-group-label")}
        </span>
        <select
          aria-label={resolveDataGridLabel(translate, "data-grid-group-aria-label")}
          value={grouping[0] ?? ""}
          class="border-grey-200 bg-background-paper rounded-md border px-2 py-1 text-sm"
          onchange={(e) => {
            const val = (e.currentTarget as HTMLSelectElement).value;
            onGroupingChange?.(val ? [val] : []);
          }}
        >
          <option value="">{resolveDataGridLabel(translate, "data-grid-group-none")}</option>
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

    {#if aiAssistantEnabled}
      <button
        type="button"
        aria-pressed={aiAssistantOpen}
        class="border-grey-200 hover:bg-grey-25 aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={onAiAssistantToggle}
      >
        <CiSparkle size="small" />
        <span>{resolveDataGridLabel(translate, "data-grid-ai-assistant")}</span>
      </button>
    {/if}

    {#if pivotable}
      <button
        type="button"
        aria-pressed={pivotMode}
        class="border-grey-200 hover:bg-grey-25 aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={onPivotToggle}
      >
        <CiPivot size="small" />
        <span>{resolveDataGridLabel(translate, "data-grid-pivot")}</span>
      </button>

      {#if pivotMode}
        <button
          type="button"
          aria-pressed={pivotPanelOpen}
          class="border-grey-200 hover:bg-grey-25 aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-primary inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
          onclick={onPivotPanelToggle}
        >
          <CiSettings size="small" />
          <span>{resolveDataGridLabel(translate, "data-grid-pivot-fields")}</span>
        </button>
      {/if}
    {/if}

    <div bind:this={columnsMenuEl} class="relative">
      <button
        type="button"
        aria-expanded={columnsOpen}
        class="border-grey-200 hover:bg-grey-25 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={() => {
          columnsOpen = !columnsOpen;
        }}
      >
        <CiEyeOpen size="small" />
        <span>{resolveDataGridLabel(translate, "data-grid-columns")}</span>
      </button>

      {#if columnsOpen}
        <div
          role="group"
          aria-label={resolveDataGridLabel(translate, "data-grid-columns-toggle-aria")}
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
      aria-label={resolveDataGridLabel(translate, "data-grid-density-aria")}
      value={density}
      class="border-grey-200 bg-background-paper rounded-md border px-2 py-1.5 text-sm"
      onchange={(e) => {
        const next = (e.currentTarget as HTMLSelectElement).value as CoimDataGridDensity;
        density = next;
        onDensityChange?.(next);
      }}
    >
      <option value="compact">{resolveDataGridLabel(translate, "data-grid-density-compact")}</option>
      <option value="standard">{resolveDataGridLabel(translate, "data-grid-density-standard")}</option>
      <option value="comfortable">{resolveDataGridLabel(translate, "data-grid-density-comfortable")}</option>
    </select>

    {#if enableExport}
      <button
        type="button"
        class="border-grey-200 hover:bg-grey-25 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={onExportCsv}
      >
        <CiDownloadCloud size="small" />
        <span>{resolveDataGridLabel(translate, "data-grid-export-csv")}</span>
      </button>
      <button
        type="button"
        class="border-grey-200 hover:bg-grey-25 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={onExportExcel}
      >
        <CiDownloadCloud size="small" />
        <span>{resolveDataGridLabel(translate, "data-grid-export-excel")}</span>
      </button>
      <button
        type="button"
        class="border-grey-200 hover:bg-grey-25 inline-flex items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm font-medium"
        onclick={onPrint}
      >
        <CiPrinter size="small" />
        <span>{resolveDataGridLabel(translate, "data-grid-export-print")}</span>
      </button>
    {/if}
  </div>
</div>
