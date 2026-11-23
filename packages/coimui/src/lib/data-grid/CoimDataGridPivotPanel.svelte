<script lang="ts" generics="TData extends Record<string, unknown> = Record<string, unknown>">
  import CiChevronDownSmall from "../icons/ui/CiChevronDownSmall.svelte";
  import CiChevronUpSmall from "../icons/ui/CiChevronUpSmall.svelte";
  import CiCross from "../icons/ui/CiCross.svelte";
  import CiDragVertical from "../icons/ui/CiDragVertical.svelte";
  import CiPivot from "../icons/ui/CiPivot.svelte";
  import CiPlus from "../icons/ui/CiPlus.svelte";
  import type {
    CoimDataGridAggregationFn,
    CoimDataGridPivotConfig,
    CoimDataGridPivotPanelProps,
  } from "./types.js";

  let { columns, config, onChange, onClose }: CoimDataGridPivotPanelProps<TData> = $props();

  let draggedField = $state<string | null>(null);
  let fieldToAdd = $state<string>("");

  const availableColumns = $derived(
    columns.filter((c) => c.type !== "actions"),
  );

  const unusedRowFields = $derived(
    availableColumns.filter(
      (c) => !config.rowFields.includes(c.id) && c.id !== config.columnField,
    ),
  );

  function columnLabel(colId: string): string {
    return availableColumns.find((c) => c.id === colId)?.headerName ?? colId;
  }

  function addRowField(colId: string) {
    if (!colId || config.rowFields.includes(colId)) return;
    onChange({
      ...config,
      rowFields: [...config.rowFields, colId],
    });
    fieldToAdd = "";
  }

  function removeRowField(colId: string) {
    if (config.rowFields.length <= 1) return;
    onChange({
      ...config,
      rowFields: config.rowFields.filter((id) => id !== colId),
    });
  }

  function moveRowField(index: number, delta: -1 | 1) {
    const targetIdx = index + delta;
    if (targetIdx < 0 || targetIdx >= config.rowFields.length) return;
    const next = [...config.rowFields];
    const [item] = next.splice(index, 1);
    next.splice(targetIdx, 0, item);
    onChange({
      ...config,
      rowFields: next,
    });
  }

  function handleRowFieldDrop(targetIndex?: number) {
    if (!draggedField) return;
    const id = draggedField;
    draggedField = null;
    const existingIdx = config.rowFields.indexOf(id);
    if (existingIdx >= 0) {
      const next = [...config.rowFields];
      next.splice(existingIdx, 1);
      const insertAt =
        targetIndex !== undefined ? Math.min(targetIndex, next.length) : next.length;
      next.splice(insertAt, 0, id);
      onChange({ ...config, rowFields: next });
      return;
    }
    const next = [...config.rowFields];
    const insertAt =
      targetIndex !== undefined ? Math.min(targetIndex, next.length) : next.length;
    next.splice(insertAt, 0, id);
    onChange({ ...config, rowFields: next });
  }

  function handleColumnFieldDrop() {
    if (!draggedField) return;
    const id = draggedField;
    draggedField = null;
    onChange({
      ...config,
      columnField: id,
      rowFields: config.rowFields.filter((f) => f !== id),
    });
  }
</script>

<div
  role="region"
  aria-label="Pivot field configurator"
  class="border-grey-50 bg-grey-25/50 border-b px-4 py-3 text-sm"
>
  <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
    <div class="flex items-center gap-2 font-semibold">
      <CiPivot size="small" class="text-primary" />
      <span>Pivot Field Configurator</span>
      <span class="text-text-secondary text-xs font-normal">
        Drag fields or use controls to configure rows, columns, and aggregations
      </span>
    </div>
    {#if onClose}
      <button
        type="button"
        aria-label="Close pivot field configurator"
        class="border-grey-200 hover:bg-grey-100 inline-flex items-center gap-1 rounded border px-2 py-1 text-xs"
        onclick={onClose}
      >
        <CiCross size="small" />
        <span>Close</span>
      </button>
    {/if}
  </div>

  <div class="mb-3 flex flex-wrap items-center gap-1.5">
    <span class="text-text-secondary text-xs font-medium">Available Fields:</span>
    {#each availableColumns as col (col.id)}
      <button
        type="button"
        draggable="true"
        ondragstart={(e) => {
          draggedField = col.id;
          e.dataTransfer?.setData("text/plain", col.id);
        }}
        class="border-grey-200 bg-background-paper hover:border-primary inline-flex cursor-grab items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs active:cursor-grabbing"
      >
        <CiDragVertical size="small" class="text-text-secondary" />
        <span>{col.headerName}</span>
      </button>
    {/each}
  </div>

  <div class="grid gap-3 md:grid-cols-4">
    <div
      role="group"
      aria-label="Row fields"
      ondragover={(e) => e.preventDefault()}
      ondrop={() => handleRowFieldDrop()}
      class="border-grey-200 bg-background-paper rounded-md border p-2.5"
    >
      <div class="text-text-secondary mb-1.5 text-xs font-semibold uppercase tracking-wide">
        Row Fields
      </div>
      <div role="list" class="flex flex-col gap-1.5">
        {#each config.rowFields as rf, idx (rf)}
          <div
            role="listitem"
            draggable="true"
            ondragstart={(e) => {
              draggedField = rf;
              e.dataTransfer?.setData("text/plain", rf);
            }}
            ondragover={(e) => e.preventDefault()}
            ondrop={(e) => {
              e.stopPropagation();
              handleRowFieldDrop(idx);
            }}
            class="border-grey-100 bg-grey-25 flex items-center justify-between gap-1 rounded border px-2 py-1 text-xs"
          >
            <span class="flex items-center gap-1 truncate font-medium">
              <CiDragVertical size="small" class="text-text-secondary shrink-0" />
              <span class="truncate">{columnLabel(rf)}</span>
            </span>
            <span class="flex items-center gap-0.5">
              <button
                type="button"
                aria-label={`Move ${columnLabel(rf)} up`}
                disabled={idx === 0}
                class="hover:bg-grey-100 inline-flex h-5 w-5 items-center justify-center rounded disabled:opacity-35"
                onclick={() => moveRowField(idx, -1)}
              >
                <CiChevronUpSmall size="small" />
              </button>
              <button
                type="button"
                aria-label={`Move ${columnLabel(rf)} down`}
                disabled={idx === config.rowFields.length - 1}
                class="hover:bg-grey-100 inline-flex h-5 w-5 items-center justify-center rounded disabled:opacity-35"
                onclick={() => moveRowField(idx, 1)}
              >
                <CiChevronDownSmall size="small" />
              </button>
              <button
                type="button"
                aria-label={`Remove row field ${columnLabel(rf)}`}
                disabled={config.rowFields.length <= 1}
                class="hover:bg-error/10 hover:text-error inline-flex h-5 w-5 items-center justify-center rounded disabled:opacity-35"
                onclick={() => removeRowField(rf)}
              >
                <CiCross size="small" />
              </button>
            </span>
          </div>
        {/each}

        {#if unusedRowFields.length > 0}
          <div class="mt-1 flex items-center gap-1">
            <select
              aria-label="Add row field"
              bind:value={fieldToAdd}
              class="border-grey-200 bg-background-paper min-w-0 flex-1 rounded border px-1.5 py-1 text-xs"
            >
              <option value="">Add row field...</option>
              {#each unusedRowFields as col (col.id)}
                <option value={col.id}>{col.headerName}</option>
              {/each}
            </select>
            <button
              type="button"
              aria-label="Confirm add row field"
              disabled={!fieldToAdd}
              class="border-grey-200 hover:bg-grey-50 inline-flex h-6 w-6 items-center justify-center rounded border disabled:opacity-40"
              onclick={() => addRowField(fieldToAdd)}
            >
              <CiPlus size="small" />
            </button>
          </div>
        {/if}
      </div>
    </div>

    <div
      role="group"
      aria-label="Column field dropzone"
      ondragover={(e) => e.preventDefault()}
      ondrop={handleColumnFieldDrop}
      class="border-grey-200 bg-background-paper rounded-md border p-2.5"
    >
      <label class="block">
        <span class="text-text-secondary mb-1.5 block text-xs font-semibold uppercase tracking-wide">
          Column Field
        </span>
        <select
          aria-label="Pivot column field"
          value={config.columnField}
          class="border-grey-200 bg-background-paper w-full rounded border px-2 py-1 text-xs"
          onchange={(e) => {
            const nextCol = (e.currentTarget as HTMLSelectElement).value;
            onChange({
              ...config,
              columnField: nextCol,
              rowFields:
                config.rowFields.length > 1
                  ? config.rowFields.filter((f) => f !== nextCol)
                  : config.rowFields,
            });
          }}
        >
          {#each availableColumns as col (col.id)}
            <option value={col.id}>{col.headerName}</option>
          {/each}
        </select>
      </label>
    </div>

    <div class="border-grey-200 bg-background-paper rounded-md border p-2.5">
      <label class="block">
        <span class="text-text-secondary mb-1.5 block text-xs font-semibold uppercase tracking-wide">
          Value Field
        </span>
        <select
          aria-label="Pivot value field"
          value={config.valueField}
          class="border-grey-200 bg-background-paper w-full rounded border px-2 py-1 text-xs"
          onchange={(e) => {
            onChange({
              ...config,
              valueField: (e.currentTarget as HTMLSelectElement).value,
            });
          }}
        >
          {#each availableColumns as col (col.id)}
            <option value={col.id}>{col.headerName}</option>
          {/each}
        </select>
      </label>
    </div>

    <div class="border-grey-200 bg-background-paper flex flex-col justify-between gap-2 rounded-md border p-2.5">
      <label class="block">
        <span class="text-text-secondary mb-1.5 block text-xs font-semibold uppercase tracking-wide">
          Aggregation
        </span>
        <select
          aria-label="Pivot aggregation"
          value={config.aggregationFn ?? "sum"}
          class="border-grey-200 bg-background-paper w-full rounded border px-2 py-1 text-xs"
          onchange={(e) => {
            onChange({
              ...config,
              aggregationFn: (e.currentTarget as HTMLSelectElement)
                .value as CoimDataGridAggregationFn,
            });
          }}
        >
          <option value="sum">Sum</option>
          <option value="mean">Mean</option>
          <option value="min">Min</option>
          <option value="max">Max</option>
          <option value="count">Count</option>
        </select>
      </label>

      <label class="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          aria-label="Show pivot row totals"
          checked={config.showRowTotals !== false}
          onchange={(e) => {
            onChange({
              ...config,
              showRowTotals: (e.currentTarget as HTMLInputElement).checked,
            });
          }}
        />
        <span>Show row totals</span>
      </label>
    </div>
  </div>
</div>
