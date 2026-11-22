<script lang="ts" generics="TData extends Record<string, unknown> = Record<string, unknown>">
  import {
    aggregationFns,
    createExpandedRowModel,
    createFilteredRowModel,
    createGroupedRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    createTable,
    filterFns,
    sortFns,
    stockFeatures,
    tableFeatures,
    type ColumnDef,
    type ColumnOrderState,
    type ColumnPinningState,
    type ColumnSizingState,
    type ColumnVisibilityState,
    type ExpandedState,
    type GroupingState,
    type PaginationState,
    type Row,
    type RowSelectionState,
    type SortingState,
    type Updater,
  } from "@tanstack/svelte-table";
  import { createVirtualizer } from "@tanstack/svelte-virtual";
  import { untrack, type Snippet } from "svelte";
  import CiArrowDown from "../icons/ui/CiArrowDown.svelte";
  import CiArrowUp from "../icons/ui/CiArrowUp.svelte";
  import CiArrowUpDown from "../icons/ui/CiArrowUpDown.svelte";
  import CiChevronDownSmall from "../icons/ui/CiChevronDownSmall.svelte";
  import CiChevronLeftSmall from "../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import CiEndLeftSmall from "../icons/ui/CiEndLeftSmall.svelte";
  import CiEndRightSmall from "../icons/ui/CiEndRightSmall.svelte";
  import { cn } from "../utilities/utils.js";
  import CoimDataGridToolbar from "./CoimDataGridToolbar.svelte";
  import {
    downloadCsvExport,
    exportDataGridToExcel,
    printDataGrid,
  } from "./export-utils.js";
  import type {
    CoimDataGridCellEditEvent,
    CoimDataGridColumn,
    CoimDataGridDensity,
    CoimDataGridPersistedState,
    CoimDataGridProps,
  } from "./types.js";

  const gridFeatures = tableFeatures({
    ...stockFeatures,
    sortedRowModel: createSortedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    groupedRowModel: createGroupedRowModel(),
    expandedRowModel: createExpandedRowModel(),
    sortFns,
    filterFns,
    aggregationFns,
  });

  type Props = CoimDataGridProps<TData>;

  let {
    rows,
    columns,
    getRowId = (row: TData, index: number) => String((row as Record<string, unknown>).id ?? index),
    getSubRows,
    paginationMode = "client",
    sortingMode = "client",
    filterMode = "client",
    rowCount,
    page = $bindable(0),
    pageSize = $bindable(10),
    pageSizeOptions = [5, 10, 25, 50],
    checkboxSelection = false,
    multiSelect = true,
    selectedRowIds = $bindable<string[]>([]),
    density = $bindable<CoimDataGridDensity>("standard"),
    showToolbar = true,
    showColumnFilters = false,
    groupable = false,
    virtualize = false,
    estimateRowHeight = 44,
    maxHeight = "32rem",
    loading = false,
    errorMessage,
    emptyMessage = "No records found.",
    storageKey,
    enableExport = true,
    exportFilename = "coimui-export",
    ariaLabel = "Data grid",
    detailPanel,
    toolbarActions,
    onPaginationChange,
    onSortChange,
    onFilterChange,
    onSelectionChange,
    onCellEditCommit,
    onRowClick,
    class: className = "",
  }: Props = $props();

  let scrollEl = $state<HTMLDivElement | null>(null);
  let tableEl = $state<HTMLTableElement | null>(null);

  let sorting = $state<SortingState>([]);
  let columnFilters = $state<{ id: string; value: unknown }[]>([]);
  let globalFilter = $state("");
  let columnVisibility = $state<ColumnVisibilityState>({});
  let columnOrder = $state<ColumnOrderState>([]);
  let columnSizing = $state<ColumnSizingState>({});
  let columnPinning = $state<ColumnPinningState>({ start: [], end: [] });
  let grouping = $state<GroupingState>([]);
  let expanded = $state<ExpandedState>({});
  let rowSelection = $state<RowSelectionState>({});
  let expandedDetailIds = $state<Record<string, boolean>>({});
  let editingCell = $state<{ rowId: string; columnId: string } | null>(null);
  let draftEditValue = $state<string>("");
  let hydratedStorage = false;

  // Initialize initial pinning / order once cleanly
  $effect.pre(() => {
    untrack(() => {
      if (columnOrder.length === 0 && columns.length > 0) {
        columnOrder = columns.map((c) => c.id);
      }
      if (columnPinning.start.length === 0 && columnPinning.end.length === 0) {
        const startPins = columns
          .filter((c) => c.pinned === "left")
          .map((c) => c.id);
        const endPins = columns
          .filter((c) => c.pinned === "right")
          .map((c) => c.id);
        if (startPins.length > 0 || endPins.length > 0) {
          columnPinning = { start: startPins, end: endPins };
        }
      }
      if (selectedRowIds.length > 0 && Object.keys(rowSelection).length === 0) {
        const map: RowSelectionState = {};
        for (const id of selectedRowIds) map[id] = true;
        rowSelection = map;
      }
    });
  });

  // Restore persisted grid state on client
  $effect(() => {
    if (!storageKey || typeof window === "undefined" || hydratedStorage) return;
    hydratedStorage = true;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<CoimDataGridPersistedState>;
      untrack(() => {
        if (parsed.columnVisibility) columnVisibility = parsed.columnVisibility;
        if (parsed.columnOrder?.length) columnOrder = parsed.columnOrder;
        if (parsed.columnSizing) columnSizing = parsed.columnSizing;
        if (parsed.columnPinning) {
          columnPinning = {
            start: parsed.columnPinning.left ?? [],
            end: parsed.columnPinning.right ?? [],
          };
        }
        if (parsed.sorting) sorting = parsed.sorting;
        if (parsed.density) density = parsed.density;
        if (typeof parsed.pageSize === "number" && parsed.pageSize > 0) {
          pageSize = parsed.pageSize;
        }
      });
    } catch {
      // Ignore corrupt stored state
    }
  });

  // Persist grid state when modified
  $effect(() => {
    if (!storageKey || typeof window === "undefined" || !hydratedStorage) return;
    const payload: CoimDataGridPersistedState = {
      columnVisibility,
      columnOrder,
      columnSizing,
      columnPinning: { left: columnPinning.start, right: columnPinning.end },
      sorting,
      density,
      pageSize,
    };
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  });

  function resolveUpdater<T>(updater: Updater<T>, prev: T): T {
    return typeof updater === "function" ? (updater as (old: T) => T)(prev) : updater;
  }

  function resolveRawValue(row: TData, col: CoimDataGridColumn<TData>): unknown {
    if (col.valueGetter) return col.valueGetter(row);
    if (col.field) return row[col.field];
    return row[col.id];
  }

  const columnLookup = $derived.by(() => {
    const map = new Map<string, CoimDataGridColumn<TData>>();
    for (const col of columns) map.set(col.id, col);
    return map;
  });

  const tableColumns = $derived.by(() =>
    columns.map(
      (col): ColumnDef<typeof gridFeatures, TData, unknown> => ({
        id: col.id,
        header: col.headerName,
        accessorFn: (row: TData) => resolveRawValue(row, col),
        enableSorting: col.sortable ?? col.type !== "actions",
        sortDescFirst: false,
        enableColumnFilter: col.filterable ?? col.type !== "actions",
        enableHiding: col.hideable ?? true,
        enableResizing: col.resizable ?? true,
        enablePinning: true,
        enableGrouping: col.groupable ?? col.type !== "actions",
        aggregationFn: col.aggregationFn,
        size: col.width ?? 150,
        minSize: col.minWidth ?? 60,
        maxSize: col.maxWidth ?? 600,
      }),
    ),
  );

  const paginationState = $derived<PaginationState>({
    pageIndex: page,
    pageSize,
  });

  const table = createTable({
    features: gridFeatures,
    get columns() {
      return tableColumns;
    },
    get data() {
      return rows;
    },
    get getRowId() {
      return getRowId;
    },
    get getSubRows() {
      return getSubRows;
    },
    get manualPagination() {
      return paginationMode === "server";
    },
    get manualSorting() {
      return sortingMode === "server";
    },
    get manualFiltering() {
      return filterMode === "server";
    },
    get rowCount() {
      return rowCount;
    },
    get enableMultiRowSelection() {
      return multiSelect;
    },
    columnResizeMode: "onChange",
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    get state() {
      return {
        sorting,
        columnFilters,
        globalFilter,
        columnVisibility,
        columnOrder,
        columnSizing,
        columnPinning,
        grouping,
        expanded,
        rowSelection,
        pagination: paginationState,
      };
    },
    onSortingChange: (updater) => {
      sorting = resolveUpdater(updater, sorting);
      onSortChange?.(sorting);
    },
    onColumnFiltersChange: (updater) => {
      columnFilters = resolveUpdater(updater, columnFilters);
      page = 0;
      onFilterChange?.({ globalFilter, columnFilters });
    },
    onGlobalFilterChange: (updater) => {
      globalFilter = resolveUpdater(updater, globalFilter);
      page = 0;
      onFilterChange?.({ globalFilter, columnFilters });
    },
    onColumnVisibilityChange: (updater) => {
      columnVisibility = resolveUpdater(updater, columnVisibility);
    },
    onColumnOrderChange: (updater) => {
      columnOrder = resolveUpdater(updater, columnOrder);
    },
    onColumnSizingChange: (updater) => {
      columnSizing = resolveUpdater(updater, columnSizing);
    },
    onColumnPinningChange: (updater) => {
      columnPinning = resolveUpdater(updater, columnPinning);
    },
    onGroupingChange: (updater) => {
      grouping = resolveUpdater(updater, grouping);
    },
    onExpandedChange: (updater) => {
      expanded = resolveUpdater(updater, expanded);
    },
    onRowSelectionChange: (updater) => {
      rowSelection = resolveUpdater(updater, rowSelection);
      const ids = Object.keys(rowSelection).filter((k) => rowSelection[k]);
      selectedRowIds = ids;
      const selectedRows = table
        .getCoreRowModel()
        .flatRows.filter((r) => rowSelection[r.id])
        .map((r) => r.original);
      onSelectionChange?.(ids, selectedRows);
    },
    onPaginationChange: (updater) => {
      const next = resolveUpdater(updater, paginationState);
      page = next.pageIndex;
      pageSize = next.pageSize;
      onPaginationChange?.(next.pageIndex, next.pageSize);
    },
  });

  // Subscribe cleanly to table store for reactive Svelte 5 updates
  const _reactiveState = $derived(table.store.get());
  const headerGroups = $derived.by(() => {
    void _reactiveState;
    return table.getHeaderGroups();
  });
  const displayRows = $derived.by(() => {
    void _reactiveState;
    return table.getRowModel().rows;
  });
  const totalPages = $derived.by(() => {
    void _reactiveState;
    return Math.max(1, table.getPageCount());
  });
  const totalFilteredCount = $derived.by(() => {
    void _reactiveState;
    if (paginationMode === "server" && typeof rowCount === "number") return rowCount;
    return table.getFilteredRowModel().rows.length;
  });

  // Optional virtualizer
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: 0,
    getScrollElement: () => scrollEl,
    estimateSize: () => estimateRowHeight,
    overscan: 6,
  });

  $effect(() => {
    if (!virtualize || !scrollEl) return;
    $virtualizer.setOptions({
      count: displayRows.length,
      getScrollElement: () => scrollEl,
      estimateSize: () => estimateRowHeight,
    });
  });

  // Client-only column drag reordering via @atlaskit/pragmatic-drag-and-drop
  $effect(() => {
    if (typeof window === "undefined" || !tableEl) return;
    let cleanups: Array<() => void> = [];
    let cancelled = false;

    void import("@atlaskit/pragmatic-drag-and-drop/adapter/element-adapter").then(
      ({ draggable, dropTargetForElements }) => {
        if (cancelled || !tableEl) return;
        const headers = Array.from(
          tableEl.querySelectorAll<HTMLElement>("th[data-col-id]"),
        );
        for (const th of headers) {
          const colId = th.dataset.colId;
          if (!colId) continue;
          cleanups.push(
            draggable({
              element: th,
              getInitialData: () => ({ colId }),
            }),
            dropTargetForElements({
              element: th,
              onDrop: ({ source }) => {
                const fromId = source.data?.colId as string | undefined;
                if (!fromId || fromId === colId) return;
                const currentOrder =
                  columnOrder.length > 0 ? [...columnOrder] : columns.map((c) => c.id);
                const fromIdx = currentOrder.indexOf(fromId);
                const toIdx = currentOrder.indexOf(colId);
                if (fromIdx < 0 || toIdx < 0) return;
                currentOrder.splice(fromIdx, 1);
                currentOrder.splice(toIdx, 0, fromId);
                columnOrder = currentOrder;
              },
            }),
          );
        }
      },
    );

    return () => {
      cancelled = true;
      for (const dispose of cleanups) dispose();
      cleanups = [];
    };
  });

  function beginEdit(row: Row<typeof gridFeatures, TData>, columnId: string, currentValue: unknown) {
    const colDef = columnLookup.get(columnId);
    if (!colDef?.editable || row.getIsGrouped()) return;
    editingCell = { rowId: row.id, columnId };
    draftEditValue = currentValue === null || currentValue === undefined ? "" : String(currentValue);
  }

  function commitEdit(row: Row<typeof gridFeatures, TData>, columnId: string, previousValue: unknown) {
    if (!editingCell || editingCell.rowId !== row.id || editingCell.columnId !== columnId) return;
    editingCell = null;
    const colDef = columnLookup.get(columnId);
    let parsedValue: unknown = draftEditValue;
    if (colDef?.type === "number") {
      const n = Number(draftEditValue);
      if (!Number.isNaN(n)) parsedValue = n;
    } else if (colDef?.type === "boolean") {
      parsedValue = draftEditValue === "true";
    }
    if (parsedValue !== previousValue) {
      onCellEditCommit?.({
        row: row.original,
        rowId: row.id,
        columnId,
        value: parsedValue,
        previousValue,
      });
    }
  }

  function cancelEdit() {
    editingCell = null;
  }

  function toggleDetailRow(rowId: string) {
    expandedDetailIds = {
      ...expandedDetailIds,
      [rowId]: !expandedDetailIds[rowId],
    };
  }

  function getExportRows(): TData[] {
    if (selectedRowIds.length > 0) {
      return table
        .getCoreRowModel()
        .flatRows.filter((r) => selectedRowIds.includes(r.id))
        .map((r) => r.original);
    }
    return table.getFilteredRowModel().rows.map((r) => r.original);
  }

  function handleGridKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null;
    if (!target || editingCell) return;
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    const cell = target.closest<HTMLElement>('[role="gridcell"], [role="columnheader"]');
    const rowEl = cell?.closest("tr");
    if (!cell || !rowEl || !tableEl) return;

    const rowsList = Array.from(tableEl.querySelectorAll<HTMLTableRowElement>("tr"));
    const rowIdx = rowsList.indexOf(rowEl);
    const cellsInRow = Array.from(rowEl.children) as HTMLElement[];
    const colIdx = cellsInRow.indexOf(cell);
    let nextCell: HTMLElement | undefined;

    if (event.key === "ArrowRight") nextCell = cellsInRow[colIdx + 1];
    else if (event.key === "ArrowLeft") nextCell = cellsInRow[colIdx - 1];
    else if (event.key === "ArrowDown") {
      nextCell = rowsList[rowIdx + 1]?.children[colIdx] as HTMLElement | undefined;
    } else if (event.key === "ArrowUp") {
      nextCell = rowsList[rowIdx - 1]?.children[colIdx] as HTMLElement | undefined;
    }

    if (nextCell) {
      event.preventDefault();
      nextCell.focus();
    }
  }

  const visibleColumnsCount = $derived(
    table.getVisibleLeafColumns().length + (checkboxSelection ? 1 : 0) + (detailPanel ? 1 : 0),
  );
  const allSelectedOnGrid = $derived.by(() => {
    void _reactiveState;
    return table.getIsAllRowsSelected();
  });
</script>

<div
  class={cn(
    "coim-data-grid",
    density === "compact" && "coim-data-grid-compact",
    density === "comfortable" && "coim-data-grid-comfortable",
    className,
  )}
>
  {#if showToolbar}
    <CoimDataGridToolbar
      bind:globalFilter
      bind:density
      columns={columns as unknown as CoimDataGridColumn<Record<string, unknown>>[]}
      {columnVisibility}
      {groupable}
      {grouping}
      {enableExport}
      onGlobalFilterChange={(val) => table.setGlobalFilter(val)}
      onColumnVisibilityToggle={(colId) => {
        columnVisibility = {
          ...columnVisibility,
          [colId]: columnVisibility[colId] === false,
        };
      }}
      onGroupingChange={(next) => {
        grouping = next;
      }}
      onExportCsv={() =>
        downloadCsvExport(getExportRows(), columns, { filename: `${exportFilename}.csv` })}
      onExportExcel={() => {
        void exportDataGridToExcel(getExportRows(), columns, { filename: `${exportFilename}.xlsx` });
      }}
      onPrint={() => printDataGrid(getExportRows(), columns, ariaLabel)}
      actions={toolbarActions}
    />
  {/if}

  {#if errorMessage}
    <div role="alert" class="bg-error/10 text-error border-error/20 border-b px-4 py-2 text-sm">
      {errorMessage}
    </div>
  {/if}

  <div
    bind:this={scrollEl}
    class="coim-data-grid-scroll"
    style={virtualize ? `max-height: ${maxHeight};` : undefined}
  >
    <table
      bind:this={tableEl}
      role="grid"
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      onkeydown={handleGridKeyDown}
      class="coim-data-grid-table"
    >
      <thead class="coim-data-grid-head">
        {#each headerGroups as headerGroup (headerGroup.id)}
          <tr>
            {#if detailPanel}
              <th style="width: 44px;" aria-label="Expand details"></th>
            {/if}
            {#if checkboxSelection}
              <th style="width: 44px;">
                {#if multiSelect}
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allSelectedOnGrid}
                    onchange={table.getToggleAllRowsSelectedHandler()}
                  />
                {/if}
              </th>
            {/if}

            {#each headerGroup.headers as header (header.id)}
              {@const colDef = columnLookup.get(header.column.id)}
              {@const sorted = header.column.getIsSorted()}
              {@const pinned = header.column.getIsPinned()}
              {@const pinStyle =
                pinned === "start"
                  ? `inset-inline-start: ${header.column.getStart("start")}px;`
                  : pinned === "end"
                    ? `inset-inline-end: ${header.column.getAfter("end")}px;`
                    : ""}
              <th
                role="columnheader"
                tabindex={0}
                data-col-id={header.column.id}
                aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : "none"}
                style={`width: ${header.getSize()}px; ${pinStyle}`}
                class={cn(
                  pinned === "start" && "coim-data-grid-cell-pinned-left",
                  pinned === "end" && "coim-data-grid-cell-pinned-right",
                )}
              >
                <div
                  class={cn(
                    "flex items-center gap-1",
                    colDef?.align === "right"
                      ? "justify-end text-end"
                      : colDef?.align === "center"
                        ? "justify-center text-center"
                        : "justify-between",
                  )}
                >
                  {#if header.column.getCanSort()}
                    <button
                      type="button"
                      class={cn(
                        "inline-flex min-w-0 items-center gap-1 font-bold",
                        colDef?.align === "right"
                          ? "justify-end text-end"
                          : colDef?.align === "center"
                            ? "justify-center text-center"
                            : "flex-1 text-start",
                      )}
                      onclick={header.column.getToggleSortingHandler()}
                    >
                      <span class="truncate">{colDef?.headerName ?? header.column.id}</span>
                      {#if sorted === "asc"}
                        <CiArrowUp size="small" aria-hidden="true" />
                      {:else if sorted === "desc"}
                        <CiArrowDown size="small" aria-hidden="true" />
                      {:else}
                        <CiArrowUpDown size="small" class="opacity-35" aria-hidden="true" />
                      {/if}
                    </button>
                  {:else}
                    <span class="truncate">{colDef?.headerName ?? header.column.id}</span>
                  {/if}
                </div>

                {#if showColumnFilters && header.column.getCanFilter()}
                  <input
                    type="text"
                    aria-label={`Filter ${colDef?.headerName ?? header.column.id}`}
                    value={(header.column.getFilterValue() as string) ?? ""}
                    placeholder="Filter..."
                    class="border-grey-200 bg-background-paper mt-1 w-full rounded border px-1.5 py-0.5 text-xs font-normal"
                    oninput={(e) => {
                      header.column.setFilterValue((e.currentTarget as HTMLInputElement).value);
                    }}
                  />
                {/if}

                {#if header.column.getCanResize()}
                  <button
                    type="button"
                    aria-label={`Resize ${colDef?.headerName ?? header.column.id} column`}
                    class={cn(
                      "coim-data-grid-resizer",
                      header.column.getIsResizing() && "is-resizing",
                    )}
                    onmousedown={header.getResizeHandler()}
                    ontouchstart={header.getResizeHandler()}
                    ondblclick={() => header.column.resetSize()}
                  ></button>
                {/if}
              </th>
            {/each}
          </tr>
        {/each}
      </thead>

      <tbody>
        {#if loading}
          {#each [0, 1, 2] as skRow (skRow)}
            <tr>
              <td colspan={visibleColumnsCount} class="coim-data-grid-cell">
                <div class="coim-skeleton coim-skeleton-wave h-5 w-full rounded"></div>
              </td>
            </tr>
          {/each}
        {:else if displayRows.length === 0}
          <tr>
            <td colspan={visibleColumnsCount} class="coim-data-grid-cell text-text-secondary py-8 text-center">
              {emptyMessage}
            </td>
          </tr>
        {:else}
          {@const virtualItems = virtualize ? $virtualizer.getVirtualItems() : null}
          {@const rowsToRender =
            virtualItems && virtualItems.length > 0
              ? virtualItems.map((vi) => displayRows[vi.index]).filter(Boolean)
              : displayRows}
          {#if virtualItems && virtualItems.length > 0 && virtualItems[0].start > 0}
            <tr aria-hidden="true">
              <td colspan={visibleColumnsCount} style={`height: ${virtualItems[0].start}px; padding: 0; border: 0;`}></td>
            </tr>
          {/if}

          {#each rowsToRender as row (row.id)}
            {@const isSelected = row.getIsSelected()}
            <tr
              aria-selected={checkboxSelection ? isSelected : undefined}
              class="coim-data-grid-row"
              onclick={() => onRowClick?.(row.original, row.id)}
            >
              {#if detailPanel}
                <td class="coim-data-grid-cell">
                  <button
                    type="button"
                    aria-expanded={Boolean(expandedDetailIds[row.id])}
                    aria-label={`Toggle details for row ${row.id}`}
                    class="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-grey-100"
                    onclick={(e) => {
                      e.stopPropagation();
                      toggleDetailRow(row.id);
                    }}
                  >
                    {#if expandedDetailIds[row.id]}
                      <CiChevronDownSmall size="small" />
                    {:else}
                      <CiChevronRightSmall size="small" />
                    {/if}
                  </button>
                </td>
              {/if}

              {#if checkboxSelection}
                <td class="coim-data-grid-cell">
                  <input
                    type="checkbox"
                    aria-label={`Select row ${row.id}`}
                    checked={isSelected}
                    disabled={!row.getCanSelect()}
                    onclick={(e) => e.stopPropagation()}
                    onchange={row.getToggleSelectedHandler()}
                  />
                </td>
              {/if}

              {#each row.getVisibleCells() as cell (cell.id)}
                {@const colDef = columnLookup.get(cell.column.id)}
                {@const rawValue = cell.getValue()}
                {@const pinned = cell.column.getIsPinned()}
                {@const pinStyle =
                  pinned === "start"
                    ? `inset-inline-start: ${cell.column.getStart("start")}px;`
                    : pinned === "end"
                      ? `inset-inline-end: ${cell.column.getAfter("end")}px;`
                      : ""}
                {@const isEditing =
                  editingCell?.rowId === row.id && editingCell?.columnId === cell.column.id}
                <td
                  role="gridcell"
                  tabindex={0}
                  style={`${pinStyle}`}
                  class={cn(
                    "coim-data-grid-cell",
                    colDef?.align === "right" && "text-end",
                    colDef?.align === "center" && "text-center",
                    pinned === "start" && "coim-data-grid-cell-pinned-left",
                    pinned === "end" && "coim-data-grid-cell-pinned-right",
                  )}
                  ondblclick={() => beginEdit(row, cell.column.id, rawValue)}
                  onkeydown={(e) => {
                    if (e.key === "F2" || (e.key === "Enter" && colDef?.editable)) {
                      e.preventDefault();
                      beginEdit(row, cell.column.id, rawValue);
                    }
                  }}
                >
                  {#if cell.getIsGrouped()}
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 font-semibold"
                      onclick={row.getToggleExpandedHandler()}
                    >
                      {#if row.getIsExpanded()}
                        <CiChevronDownSmall size="small" />
                      {:else}
                        <CiChevronRightSmall size="small" />
                      {/if}
                      <span>{colDef?.valueFormatter ? colDef.valueFormatter(rawValue, row.original) : String(rawValue ?? "")}</span>
                      <span class="text-text-secondary text-xs">({row.subRows.length})</span>
                    </button>
                  {:else if cell.getIsAggregated()}
                    <span class="text-text-secondary font-medium">
                      {String(rawValue ?? "")}
                    </span>
                  {:else if cell.getIsPlaceholder()}
                    <span></span>
                  {:else if isEditing}
                    {#if colDef?.options && colDef.options.length > 0}
                      <select
                        aria-label={`Edit ${colDef.headerName}`}
                        bind:value={draftEditValue}
                        class="border-primary bg-background-paper w-full rounded border px-1.5 py-0.5 text-sm"
                        onclick={(e) => e.stopPropagation()}
                        onblur={() => commitEdit(row, cell.column.id, rawValue)}
                        onkeydown={(e) => {
                          e.stopPropagation();
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitEdit(row, cell.column.id, rawValue);
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            cancelEdit();
                          }
                        }}
                      >
                        {#each colDef.options as opt (opt)}
                          <option value={opt}>{opt}</option>
                        {/each}
                      </select>
                    {:else}
                      <input
                        type={colDef?.type === "number" ? "number" : "text"}
                        aria-label={`Edit ${colDef?.headerName ?? cell.column.id}`}
                        bind:value={draftEditValue}
                        class="border-primary bg-background-paper w-full rounded border px-1.5 py-0.5 text-sm"
                        onclick={(e) => e.stopPropagation()}
                        onblur={() => commitEdit(row, cell.column.id, rawValue)}
                        onkeydown={(e) => {
                          e.stopPropagation();
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commitEdit(row, cell.column.id, rawValue);
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            cancelEdit();
                          }
                        }}
                      />
                    {/if}
                  {:else}
                    <div
                      class={cn(
                        "flex items-center gap-1.5",
                        colDef?.align === "right" && "justify-end",
                        colDef?.align === "center" && "justify-center",
                      )}
                      style={row.depth > 0 && cell.column.getIndex() === 0 ? `padding-inline-start: ${row.depth * 1.25}rem;` : undefined}
                    >
                      {#if row.getCanExpand() && cell.column.getIndex() === 0}
                        <button
                          type="button"
                          aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
                          class="inline-flex h-5 w-5 items-center justify-center rounded hover:bg-grey-100"
                          onclick={(e) => {
                            e.stopPropagation();
                            row.toggleExpanded();
                          }}
                        >
                          {#if row.getIsExpanded()}
                            <CiChevronDownSmall size="small" />
                          {:else}
                            <CiChevronRightSmall size="small" />
                          {/if}
                        </button>
                      {/if}

                      {#if colDef?.renderCell}
                        {@render colDef.renderCell({
                          value: rawValue,
                          row: row.original,
                          rowId: row.id,
                          column: colDef,
                        })}
                      {:else}
                        <span class="truncate">
                          {colDef?.valueFormatter
                            ? colDef.valueFormatter(rawValue, row.original)
                            : String(rawValue ?? "")}
                        </span>
                      {/if}
                    </div>
                  {/if}
                </td>
              {/each}
            </tr>

            {#if detailPanel && expandedDetailIds[row.id]}
              <tr>
                <td colspan={visibleColumnsCount} class="coim-data-grid-detail-cell">
                  {@render detailPanel({ row: row.original, rowId: row.id })}
                </td>
              </tr>
            {/if}
          {/each}

          {#if virtualItems && virtualItems.length > 0}
            {@const totalHeight = $virtualizer.getTotalSize()}
            {@const lastEnd = virtualItems[virtualItems.length - 1].end}
            {#if totalHeight > lastEnd}
              <tr aria-hidden="true">
                <td colspan={visibleColumnsCount} style={`height: ${totalHeight - lastEnd}px; padding: 0; border: 0;`}></td>
              </tr>
            {/if}
          {/if}
        {/if}
      </tbody>
    </table>
  </div>

  <div class="coim-data-grid-footer">
    <div class="text-text-secondary flex items-center gap-2">
      <span>{totalFilteredCount} total row(s)</span>
      {#if selectedRowIds.length > 0}
        <span class="text-primary font-medium">· {selectedRowIds.length} selected</span>
      {/if}
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <label class="flex items-center gap-1.5">
        <span class="text-text-secondary">Rows:</span>
        <select
          aria-label="Rows per page"
          value={pageSize}
          class="border-grey-200 bg-background-paper rounded border px-2 py-1 text-sm"
          onchange={(e) => {
            const nextSize = Number((e.currentTarget as HTMLSelectElement).value);
            table.setPageSize(nextSize);
          }}
        >
          {#each pageSizeOptions as opt (opt)}
            <option value={opt}>{opt}</option>
          {/each}
        </select>
      </label>

      <span class="text-text-secondary">Page {page + 1} of {totalPages}</span>

      <div class="flex items-center gap-1">
        <button
          type="button"
          aria-label="First page"
          disabled={!table.getCanPreviousPage()}
          class="hover:bg-grey-50 disabled:opacity-disabled rounded p-1"
          onclick={() => table.firstPage()}
        >
          <CiEndLeftSmall size="small" />
        </button>
        <button
          type="button"
          aria-label="Previous page"
          disabled={!table.getCanPreviousPage()}
          class="hover:bg-grey-50 disabled:opacity-disabled rounded p-1"
          onclick={() => table.previousPage()}
        >
          <CiChevronLeftSmall size="small" />
        </button>
        <button
          type="button"
          aria-label="Next page"
          disabled={!table.getCanNextPage()}
          class="hover:bg-grey-50 disabled:opacity-disabled rounded p-1"
          onclick={() => table.nextPage()}
        >
          <CiChevronRightSmall size="small" />
        </button>
        <button
          type="button"
          aria-label="Last page"
          disabled={!table.getCanNextPage()}
          class="hover:bg-grey-50 disabled:opacity-disabled rounded p-1"
          onclick={() => table.lastPage()}
        >
          <CiEndRightSmall size="small" />
        </button>
      </div>
    </div>
  </div>
</div>
