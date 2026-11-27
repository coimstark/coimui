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
  import CiBinEmpty from "../icons/ui/CiBinEmpty.svelte";
  import CiCheck from "../icons/ui/CiCheck.svelte";
  import CiChevronDownSmall from "../icons/ui/CiChevronDownSmall.svelte";
  import CiChevronLeftSmall from "../icons/ui/CiChevronLeftSmall.svelte";
  import CiChevronRightSmall from "../icons/ui/CiChevronRightSmall.svelte";
  import CiCross from "../icons/ui/CiCross.svelte";
  import CiDragVertical from "../icons/ui/CiDragVertical.svelte";
  import CiEndLeftSmall from "../icons/ui/CiEndLeftSmall.svelte";
  import CiEndRightSmall from "../icons/ui/CiEndRightSmall.svelte";
  import CiPen from "../icons/ui/CiPen.svelte";
  import { cn } from "../utilities/utils.js";
  import CoimDataGridAiBar from "./CoimDataGridAiBar.svelte";
  import CoimDataGridPivotPanel from "./CoimDataGridPivotPanel.svelte";
  import CoimDataGridToolbar from "./CoimDataGridToolbar.svelte";
  import {
    downloadCsvExport,
    exportDataGridToExcel,
    printDataGrid,
  } from "./export-utils.js";
  import { resolveDataGridLabel } from "./i18n.js";
  import { buildPivotTable } from "./pivot-utils.js";
  import type {
    CoimDataGridAiQueryResult,
    CoimDataGridCellCoord,
    CoimDataGridCellEditEvent,
    CoimDataGridColumn,
    CoimDataGridColumnGroup,
    CoimDataGridDensity,
    CoimDataGridPersistedState,
    CoimDataGridPinnedRows,
    CoimDataGridPivotConfig,
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
    emptyMessage,
    storageKey,
    enableExport = true,
    exportFilename = "coimui-export",
    ariaLabel,
    columnGroups,
    groupHeaderHeight,
    editMode = "cell",
    onRowEditCommit,
    onRowEditCancel,
    onRowDelete,
    pivotMode = $bindable(false),
    pivotConfig,
    onPivotModeChange,
    onPivotConfigChange,
    enableAiAssistant = false,
    aiProvider,
    onAiQueryApplied,
    showSummaryRow = false,
    pinnedRows,
    rowReordering = false,
    onRowOrderChange,
    cellSelection = false,
    selectedCells = $bindable<CoimDataGridCellCoord[]>([]),
    onCellSelectionChange,
    enableClipboardPaste = false,
    onClipboardPaste,
    hasMore = false,
    onLoadMore,
    virtualizeColumns = false,
    columnOverscan = 2,
    detailPanel,
    toolbarActions,
    translate,
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
  let scrollLeft = $state(0);
  let scrollViewportWidth = $state(900);
  let lastLoadCount = $state(-1);

  let orderedRowIds = $state<string[] | null>(null);
  let activeCell = $state<CoimDataGridCellCoord | null>(null);
  let selectionAnchor = $state<CoimDataGridCellCoord | null>(null);
  let collapsedGroups = $state<Record<string, boolean>>({});
  let editingRowId = $state<string | null>(null);
  let rowEditDraft = $state<Record<string, string>>({});
  let internalPivotConfig = $state<CoimDataGridPivotConfig | undefined>(undefined);
  let pivotPanelOpen = $state(false);
  let aiAssistantOpen = $state(false);

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

  const resolvedAriaLabel = $derived(
    ariaLabel ?? resolveDataGridLabel(translate, "data-grid-aria-label"),
  );
  const resolvedEmptyMessage = $derived(
    emptyMessage ?? resolveDataGridLabel(translate, "data-grid-empty"),
  );
  const effectivePivotConfig = $derived(internalPivotConfig ?? pivotConfig);
  const pivotActive = $derived(Boolean(pivotMode && effectivePivotConfig));
  const pivotResult = $derived.by(() =>
    pivotActive && effectivePivotConfig
      ? buildPivotTable(rows, columns, effectivePivotConfig, { translate })
      : null,
  );
  const activeColumns = $derived.by<CoimDataGridColumn<TData>[]>(() =>
    pivotResult ? (pivotResult.columns as unknown as CoimDataGridColumn<TData>[]) : columns,
  );
  const activeColumnGroups = $derived(pivotResult ? pivotResult.columnGroups : columnGroups);
  const showRowActions = $derived((editMode === "row" || Boolean(onRowDelete)) && !pivotActive);

  function isGroupCollapsed(grp: CoimDataGridColumnGroup): boolean {
    if (collapsedGroups[grp.id] !== undefined) {
      return collapsedGroups[grp.id];
    }
    return Boolean(grp.defaultCollapsed);
  }

  function getGroupToggleTargets(grp: CoimDataGridColumnGroup): string[] {
    if (grp.collapsibleColumns && grp.collapsibleColumns.length > 0) {
      return grp.collapsibleColumns;
    }
    return grp.children.slice(1);
  }

  function toggleColumnGroup(grp: CoimDataGridColumnGroup) {
    if (!grp.collapsible) return;
    const targets = getGroupToggleTargets(grp);
    if (targets.length === 0) return;
    const nextCollapsed = !isGroupCollapsed(grp);
    collapsedGroups = {
      ...collapsedGroups,
      [grp.id]: nextCollapsed,
    };
    const nextVis = { ...columnVisibility };
    for (const colId of targets) {
      nextVis[colId] = !nextCollapsed;
    }
    columnVisibility = nextVis;
  }

  const effectiveColumnVisibility = $derived.by(() => {
    if (pivotActive) return {} as ColumnVisibilityState;
    const merged: ColumnVisibilityState = { ...columnVisibility };
    if (activeColumnGroups) {
      for (const grp of activeColumnGroups) {
        if (!grp.collapsible || !isGroupCollapsed(grp)) continue;
        for (const colId of getGroupToggleTargets(grp)) {
          if (merged[colId] === undefined) {
            merged[colId] = false;
          }
        }
      }
    }
    return merged;
  });

  const effectiveColumnOrder = $derived(
    pivotActive ? activeColumns.map((c) => c.id) : columnOrder,
  );

  const effectiveColumnPinning = $derived<ColumnPinningState>(
    pivotActive ? { start: [], end: [] } : columnPinning,
  );

  const effectiveGetRowId = $derived(
    pivotResult
      ? (row: TData, index: number) => String((row as Record<string, unknown>).id ?? index)
      : getRowId,
  );

  const columnLookup = $derived.by(() => {
    const map = new Map<string, CoimDataGridColumn<TData>>();
    for (const col of activeColumns) map.set(col.id, col);
    return map;
  });

  const tableColumns = $derived.by(() =>
    activeColumns.map(
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

  const effectiveRows = $derived.by(() => {
    if (pivotResult) return pivotResult.rows as unknown as TData[];
    if (!rowReordering || !orderedRowIds) return rows;
    const byId = new Map<string, TData>();
    rows.forEach((row, idx) => byId.set(getRowId(row, idx), row));
    const ordered: TData[] = [];
    const seen = new Set<string>();
    for (const id of orderedRowIds) {
      const match = byId.get(id);
      if (match) {
        ordered.push(match);
        seen.add(id);
      }
    }
    rows.forEach((row, idx) => {
      const id = getRowId(row, idx);
      if (!seen.has(id)) ordered.push(row);
    });
    return ordered;
  });

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
      return effectiveRows;
    },
    get getRowId() {
      return effectiveGetRowId;
    },
    get getSubRows() {
      return pivotResult ? undefined : getSubRows;
    },
    get manualPagination() {
      return !pivotResult && paginationMode === "server";
    },
    get manualSorting() {
      return !pivotResult && sortingMode === "server";
    },
    get manualFiltering() {
      return !pivotResult && filterMode === "server";
    },
    get rowCount() {
      return pivotResult ? undefined : rowCount;
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
        columnVisibility: effectiveColumnVisibility,
        columnOrder: effectiveColumnOrder,
        columnSizing,
        columnPinning: effectiveColumnPinning,
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

  const topPinIds = $derived(pinnedRows?.top ?? []);
  const bottomPinIds = $derived(pinnedRows?.bottom ?? []);

  const topPinnedRows = $derived.by(() => {
    void _reactiveState;
    if (topPinIds.length === 0) return [] as Row<typeof gridFeatures, TData>[];
    const byId = new Map(
      table
        .getCoreRowModel()
        .flatRows.filter((r) => !r.getIsGrouped())
        .map((r) => [r.id, r]),
    );
    return topPinIds
      .map((id) => byId.get(id))
      .filter((r): r is Row<typeof gridFeatures, TData> => Boolean(r));
  });

  const bottomPinnedRows = $derived.by(() => {
    void _reactiveState;
    if (bottomPinIds.length === 0) return [] as Row<typeof gridFeatures, TData>[];
    const topSet = new Set(topPinIds);
    const byId = new Map(
      table
        .getCoreRowModel()
        .flatRows.filter((r) => !r.getIsGrouped())
        .map((r) => [r.id, r]),
    );
    return bottomPinIds
      .filter((id) => !topSet.has(id))
      .map((id) => byId.get(id))
      .filter((r): r is Row<typeof gridFeatures, TData> => Boolean(r));
  });

  const pinnedIdSet = $derived(new Set([...topPinIds, ...bottomPinIds]));
  const unpinnedRows = $derived(
    pinnedIdSet.size === 0 ? displayRows : displayRows.filter((r) => !pinnedIdSet.has(r.id)),
  );

  // Header slices (handles optional horizontal column virtualization while keeping pinned edges sticky)
  const leafHeaders = $derived(headerGroups[headerGroups.length - 1]?.headers ?? []);
  const columnSlice = $derived.by(() => {
    const startPinned = leafHeaders.filter((h) => h.column.getIsPinned() === "start");
    const endPinned = leafHeaders.filter((h) => h.column.getIsPinned() === "end");
    const center = leafHeaders.filter((h) => !h.column.getIsPinned());

    if (!virtualizeColumns || Boolean(activeColumnGroups?.length) || center.length === 0) {
      return {
        startPinned,
        middle: center,
        endPinned,
        leftSpacerCols: 0,
        leftSpacerWidth: 0,
        rightSpacerCols: 0,
        rightSpacerWidth: 0,
      };
    }

    const startPinWidth = startPinned.reduce((acc, h) => acc + h.getSize(), 0);
    const visibleWidth = Math.max(240, scrollViewportWidth - startPinWidth);
    const windowStart = Math.max(0, scrollLeft);
    const windowEnd = windowStart + visibleWidth;

    let acc = 0;
    let firstIdx = 0;
    let lastIdx = center.length - 1;
    let foundFirst = false;

    for (let i = 0; i < center.length; i += 1) {
      const w = center[i].getSize();
      const nextAcc = acc + w;
      if (!foundFirst && nextAcc >= windowStart) {
        firstIdx = i;
        foundFirst = true;
      }
      if (acc <= windowEnd) {
        lastIdx = i;
      }
      acc = nextAcc;
    }

    const overscan = Math.max(0, columnOverscan);
    const startIdx = Math.max(0, firstIdx - overscan);
    const endIdx = Math.min(center.length - 1, lastIdx + overscan);

    const leftSpacerCols = startIdx;
    const leftSpacerWidth = center.slice(0, startIdx).reduce((sum, h) => sum + h.getSize(), 0);
    const rightSpacerCols = Math.max(0, center.length - 1 - endIdx);
    const rightSpacerWidth = center.slice(endIdx + 1).reduce((sum, h) => sum + h.getSize(), 0);

    return {
      startPinned,
      middle: center.slice(startIdx, endIdx + 1),
      endPinned,
      leftSpacerCols,
      leftSpacerWidth,
      rightSpacerCols,
      rightSpacerWidth,
    };
  });

  const visibleRenderHeaders = $derived([
    ...columnSlice.startPinned,
    ...columnSlice.middle,
    ...columnSlice.endPinned,
  ]);

  const columnGroupHeaderCells = $derived.by(() => {
    if (!activeColumnGroups || activeColumnGroups.length === 0 || leafHeaders.length === 0) {
      return [] as Array<{
        id: string;
        group?: CoimDataGridColumnGroup;
        headerName: string;
        colSpan: number;
        isGroup: boolean;
        collapsible: boolean;
        collapsed: boolean;
      }>;
    }
    const colToGroup = new Map<string, CoimDataGridColumnGroup>();
    for (const grp of activeColumnGroups) {
      for (const childId of grp.children) {
        colToGroup.set(childId, grp);
      }
    }
    const cells: Array<{
      id: string;
      group?: CoimDataGridColumnGroup;
      headerName: string;
      colSpan: number;
      isGroup: boolean;
      collapsible: boolean;
      collapsed: boolean;
    }> = [];
    for (const h of visibleRenderHeaders) {
      const grp = colToGroup.get(h.column.id);
      const key = grp ? `grp:${grp.id}` : `col:${h.column.id}`;
      const prev = cells[cells.length - 1];
      if (prev && grp && prev.id === key) {
        prev.colSpan += 1;
      } else {
        const collapsible = Boolean(grp?.collapsible && getGroupToggleTargets(grp).length > 0);
        cells.push({
          id: key,
          group: grp,
          headerName: grp?.headerName ?? "",
          colSpan: 1,
          isGroup: Boolean(grp),
          collapsible,
          collapsed: grp ? isGroupCollapsed(grp) : false,
        });
      }
    }
    return cells;
  });

  const renderSummaryRow = $derived(
    showSummaryRow && activeColumns.some((c) => Boolean(c.aggregationFn)),
  );

  function computeSummaryText(colDef: CoimDataGridColumn<TData>): string {
    if (!colDef.aggregationFn) return "";
    const leafRows = table.getFilteredRowModel().flatRows.filter((r) => !r.getIsGrouped());
    if (colDef.aggregationFn === "count") {
      return resolveDataGridLabel(translate, "data-grid-summary-format", {
        label: resolveDataGridLabel(translate, "data-grid-agg-count"),
        value: leafRows.length,
      });
    }
    const nums = leafRows
      .map((r) => Number(resolveRawValue(r.original, colDef)))
      .filter((n) => Number.isFinite(n));
    if (nums.length === 0) return "";
    let result = 0;
    let prefixKey = "data-grid-agg-sum";
    if (colDef.aggregationFn === "sum") {
      result = nums.reduce((a, b) => a + b, 0);
      prefixKey = "data-grid-agg-sum";
    } else if (colDef.aggregationFn === "min") {
      result = Math.min(...nums);
      prefixKey = "data-grid-agg-min";
    } else if (colDef.aggregationFn === "max") {
      result = Math.max(...nums);
      prefixKey = "data-grid-agg-max";
    } else if (colDef.aggregationFn === "mean") {
      result = nums.reduce((a, b) => a + b, 0) / nums.length;
      prefixKey = "data-grid-agg-avg";
    }
    const formatted = colDef.valueFormatter
      ? colDef.valueFormatter(result, leafRows[0].original)
      : Number.isInteger(result)
        ? String(result)
        : result.toFixed(2);
    return resolveDataGridLabel(translate, "data-grid-summary-format", {
      label: resolveDataGridLabel(translate, prefixKey),
      value: formatted,
    });
  }

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
      count: unpinnedRows.length,
      getScrollElement: () => scrollEl,
      estimateSize: () => estimateRowHeight,
    });
  });

  $effect(() => {
    if (!scrollEl || typeof window === "undefined") return;
    scrollViewportWidth = scrollEl.clientWidth || 900;
  });

  function moveRowOrder(fromId: string, toId: string) {
    if (!fromId || !toId || fromId === toId) return;
    const baseIds = effectiveRows.map((r, idx) => getRowId(r, idx));
    const fromIdx = baseIds.indexOf(fromId);
    const toIdx = baseIds.indexOf(toId);
    if (fromIdx < 0 || toIdx < 0) return;
    const nextIds = [...baseIds];
    nextIds.splice(fromIdx, 1);
    nextIds.splice(toIdx, 0, fromId);
    orderedRowIds = nextIds;

    const byId = new Map(effectiveRows.map((r, idx) => [getRowId(r, idx), r]));
    const nextRows = nextIds.map((id) => byId.get(id)).filter((r): r is TData => Boolean(r));
    onRowOrderChange?.(nextIds, nextRows);
  }

  function moveRowByOffset(rowId: string, offset: -1 | 1) {
    const baseIds = effectiveRows.map((r, idx) => getRowId(r, idx));
    const fromIdx = baseIds.indexOf(rowId);
    const targetIdx = fromIdx + offset;
    if (fromIdx < 0 || targetIdx < 0 || targetIdx >= baseIds.length) return;
    moveRowOrder(rowId, baseIds[targetIdx]);
  }

  // Client-only column & row drag reordering via @atlaskit/pragmatic-drag-and-drop
  $effect(() => {
    if (typeof window === "undefined" || !tableEl) return;
    const dragRowsKey = rowReordering ? effectiveRows.map((r, i) => getRowId(r, i)).join(",") : "";
    void dragRowsKey;
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
              getInitialData: () => ({ type: "grid-col", colId }),
            }),
            dropTargetForElements({
              element: th,
              onDrop: ({ source }) => {
                if (source.data?.type !== "grid-col") return;
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

        if (rowReordering) {
          const rowEls = Array.from(tableEl.querySelectorAll<HTMLElement>("tr[data-row-drag-id]"));
          for (const tr of rowEls) {
            const rowId = tr.dataset.rowDragId;
            if (!rowId) continue;
            const dragHandle = tr.querySelector<HTMLElement>("[data-row-drag-handle]") ?? undefined;
            cleanups.push(
              draggable({
                element: tr,
                dragHandle,
                getInitialData: () => ({ type: "grid-row", rowId }),
              }),
              dropTargetForElements({
                element: tr,
                onDrop: ({ source }) => {
                  if (source.data?.type !== "grid-row") return;
                  const fromId = source.data?.rowId as string | undefined;
                  if (fromId) moveRowOrder(fromId, rowId);
                },
              }),
            );
          }
        }
      },
    );

    return () => {
      cancelled = true;
      for (const dispose of cleanups) dispose();
      cleanups = [];
    };
  });

  function toEditableString(colDef: CoimDataGridColumn<TData> | undefined, val: unknown): string {
    if (val === null || val === undefined) return "";
    if (colDef?.type === "boolean") return Boolean(val) ? "true" : "false";
    if (colDef?.type === "date") {
      if (val instanceof Date && !Number.isNaN(val.getTime())) {
        return val.toISOString().slice(0, 10);
      }
      return String(val).slice(0, 10);
    }
    return String(val);
  }

  function coerceEditValue(raw: string, colDef: CoimDataGridColumn<TData> | undefined): unknown {
    if (colDef?.type === "number") {
      const n = Number(raw);
      return Number.isNaN(n) ? raw : n;
    }
    if (colDef?.type === "boolean") {
      const normalized = raw.trim().toLowerCase();
      return normalized === "true" || normalized === "1" || normalized === "yes";
    }
    return raw;
  }

  function beginRowEdit(row: Row<typeof gridFeatures, TData>) {
    if (!showRowActions || row.getIsGrouped()) return;
    editingCell = null;
    editingRowId = row.id;
    const draft: Record<string, string> = {};
    for (const col of activeColumns) {
      if (col.editable) {
        draft[col.id] = toEditableString(col, resolveRawValue(row.original, col));
      }
    }
    rowEditDraft = draft;
  }

  function cancelRowEdit(rowId = editingRowId) {
    if (!rowId) return;
    editingRowId = null;
    rowEditDraft = {};
    onRowEditCancel?.(rowId);
  }

  function commitRowEdit(row: Row<typeof gridFeatures, TData>) {
    if (editingRowId !== row.id) return;
    const updates: Record<string, unknown> = {};
    const changedFields: string[] = [];
    for (const col of activeColumns) {
      if (!col.editable) continue;
      const prevVal = resolveRawValue(row.original, col);
      const rawDraft = rowEditDraft[col.id];
      const nextVal = rawDraft !== undefined ? coerceEditValue(rawDraft, col) : prevVal;
      if (nextVal !== prevVal) {
        const targetKey = col.field ?? col.id;
        updates[targetKey] = nextVal;
        changedFields.push(targetKey);
      }
    }
    const nextRow = { ...row.original, ...updates } as TData;
    editingRowId = null;
    rowEditDraft = {};
    onRowEditCommit?.({
      rowId: row.id,
      row: nextRow,
      previousRow: row.original,
      changedFields,
    });
  }

  function togglePivotMode() {
    if (!effectivePivotConfig) return;
    const next = !pivotMode;
    pivotMode = next;
    if (!next) {
      pivotPanelOpen = false;
    }
    sorting = [];
    columnFilters = [];
    grouping = [];
    expanded = {};
    editingCell = null;
    editingRowId = null;
    rowEditDraft = {};
    page = 0;
    onPivotModeChange?.(next);
  }

  function updatePivotConfig(next: CoimDataGridPivotConfig) {
    internalPivotConfig = next;
    page = 0;
    onPivotConfigChange?.(next);
  }

  function applyAiQueryResult(result: CoimDataGridAiQueryResult) {
    if (result.globalFilter !== undefined) {
      globalFilter = result.globalFilter;
    }
    if (result.columnFilters !== undefined) {
      columnFilters = result.columnFilters;
    }
    if (result.globalFilter !== undefined || result.columnFilters !== undefined) {
      onFilterChange?.({ globalFilter, columnFilters });
    }
    if (result.sorting !== undefined) {
      sorting = result.sorting;
      onSortChange?.(sorting);
    }
    if (result.grouping !== undefined) {
      grouping = result.grouping;
    }
    if (result.pivotConfig) {
      internalPivotConfig = result.pivotConfig;
      pivotMode = true;
      onPivotConfigChange?.(result.pivotConfig);
      onPivotModeChange?.(true);
    }
    page = 0;
    onAiQueryApplied?.(result);
  }

  function resetAiFilters() {
    globalFilter = "";
    columnFilters = [];
    sorting = [];
    grouping = [];
    page = 0;
    onFilterChange?.({ globalFilter: "", columnFilters: [] });
    onSortChange?.([]);
  }

  function beginEdit(row: Row<typeof gridFeatures, TData>, columnId: string, currentValue: unknown) {
    if (pivotActive) return;
    const colDef = columnLookup.get(columnId);
    if (!colDef?.editable || row.getIsGrouped()) return;
    if (editMode === "row") {
      beginRowEdit(row);
      return;
    }
    editingCell = { rowId: row.id, columnId };
    draftEditValue = toEditableString(colDef, currentValue);
  }

  function commitEdit(row: Row<typeof gridFeatures, TData>, columnId: string, previousValue: unknown) {
    if (!editingCell || editingCell.rowId !== row.id || editingCell.columnId !== columnId) return;
    editingCell = null;
    const colDef = columnLookup.get(columnId);
    const parsedValue = coerceEditValue(draftEditValue, colDef);
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

  function handleEditorKeyDown(
    e: KeyboardEvent,
    row: Row<typeof gridFeatures, TData>,
    columnId: string,
    previousValue: unknown,
    isRowEdit: boolean,
  ) {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      if (isRowEdit) commitRowEdit(row);
      else commitEdit(row, columnId, previousValue);
    } else if (e.key === "Escape") {
      e.preventDefault();
      if (isRowEdit) cancelRowEdit(row.id);
      else cancelEdit();
    }
  }

  function toggleDetailRow(rowId: string) {
    expandedDetailIds = {
      ...expandedDetailIds,
      [rowId]: !expandedDetailIds[rowId],
    };
  }

  function isCellSelected(rowId: string, columnId: string): boolean {
    return selectedCells.some((c) => c.rowId === rowId && c.columnId === columnId);
  }

  function getVisibleDataRowsOrder(): Row<typeof gridFeatures, TData>[] {
    return [...topPinnedRows, ...unpinnedRows, ...bottomPinnedRows];
  }

  function selectGridCell(
    rowId: string,
    columnId: string,
    opts: { shiftKey?: boolean; metaOrCtrl?: boolean } = {},
  ) {
    activeCell = { rowId, columnId };
    if (!cellSelection) return;

    const allRows = getVisibleDataRowsOrder();
    const visibleColIds = leafHeaders.map((h) => h.column.id);

    if (opts.shiftKey && selectionAnchor) {
      const r1 = allRows.findIndex((r) => r.id === selectionAnchor!.rowId);
      const r2 = allRows.findIndex((r) => r.id === rowId);
      const c1 = visibleColIds.indexOf(selectionAnchor.columnId);
      const c2 = visibleColIds.indexOf(columnId);
      if (r1 >= 0 && r2 >= 0 && c1 >= 0 && c2 >= 0) {
        const rMin = Math.min(r1, r2);
        const rMax = Math.max(r1, r2);
        const cMin = Math.min(c1, c2);
        const cMax = Math.max(c1, c2);
        const range: CoimDataGridCellCoord[] = [];
        for (let r = rMin; r <= rMax; r += 1) {
          for (let c = cMin; c <= cMax; c += 1) {
            range.push({ rowId: allRows[r].id, columnId: visibleColIds[c] });
          }
        }
        selectedCells = range;
        onCellSelectionChange?.(range);
        return;
      }
    }

    if (opts.metaOrCtrl) {
      const exists = isCellSelected(rowId, columnId);
      const next = exists
        ? selectedCells.filter((c) => !(c.rowId === rowId && c.columnId === columnId))
        : [...selectedCells, { rowId, columnId }];
      selectedCells = next;
      selectionAnchor = { rowId, columnId };
      onCellSelectionChange?.(next);
      return;
    }

    const single = [{ rowId, columnId }];
    selectedCells = single;
    selectionAnchor = { rowId, columnId };
    onCellSelectionChange?.(single);
  }

  function copySelectedCellsToClipboard() {
    if (!cellSelection || selectedCells.length === 0 || typeof navigator === "undefined") return;
    const allRows = getVisibleDataRowsOrder();
    const visibleColIds = leafHeaders.map((h) => h.column.id);
    const rowIndices = Array.from(
      new Set(selectedCells.map((c) => allRows.findIndex((r) => r.id === c.rowId)).filter((i) => i >= 0)),
    ).sort((a, b) => a - b);
    const colIndices = Array.from(
      new Set(selectedCells.map((c) => visibleColIds.indexOf(c.columnId)).filter((i) => i >= 0)),
    ).sort((a, b) => a - b);
    if (rowIndices.length === 0 || colIndices.length === 0) return;

    const tsv = rowIndices
      .map((rIdx) => {
        const row = allRows[rIdx];
        return colIndices
          .map((cIdx) => {
            const colId = visibleColIds[cIdx];
            const colDef = columnLookup.get(colId);
            const raw = colDef ? resolveRawValue(row.original, colDef) : "";
            return raw === null || raw === undefined ? "" : String(raw);
          })
          .join("\t");
      })
      .join("\n");

    void navigator.clipboard?.writeText?.(tsv).catch(() => {});
  }

  function handleTablePaste(event: ClipboardEvent) {
    if (!enableClipboardPaste || editingCell) return;
    const anchor = selectedCells[0] ?? activeCell;
    if (!anchor) return;
    const rawText = event.clipboardData?.getData("text/plain") ?? "";
    if (!rawText) return;

    const lines = rawText.replace(/\r\n/g, "\n").replace(/\n$/, "").split("\n");
    const matrix = lines.map((line) => (line.includes("\t") ? line.split("\t") : [line]));

    const allRows = getVisibleDataRowsOrder();
    const visibleColIds = leafHeaders.map((h) => h.column.id);
    const startRowIdx = allRows.findIndex((r) => r.id === anchor.rowId);
    const startColIdx = visibleColIds.indexOf(anchor.columnId);
    if (startRowIdx < 0 || startColIdx < 0) return;

    const updates: CoimDataGridCellEditEvent<TData>[] = [];
    for (let rOff = 0; rOff < matrix.length; rOff += 1) {
      const targetRow = allRows[startRowIdx + rOff];
      if (!targetRow || targetRow.getIsGrouped()) continue;
      for (let cOff = 0; cOff < matrix[rOff].length; cOff += 1) {
        const colId = visibleColIds[startColIdx + cOff];
        if (!colId) continue;
        const colDef = columnLookup.get(colId);
        if (!colDef?.editable) continue;
        const previousValue = resolveRawValue(targetRow.original, colDef);
        const value = coerceEditValue(matrix[rOff][cOff], colDef);
        if (value !== previousValue) {
          const ev: CoimDataGridCellEditEvent<TData> = {
            row: targetRow.original,
            rowId: targetRow.id,
            columnId: colId,
            value,
            previousValue,
          };
          updates.push(ev);
          onCellEditCommit?.(ev);
        }
      }
    }

    if (updates.length > 0) {
      event.preventDefault();
      onClipboardPaste?.(updates);
    }
  }

  function handleScrollContainerScroll(event: Event) {
    const el = event.currentTarget as HTMLDivElement;
    scrollLeft = el.scrollLeft;
    scrollViewportWidth = el.clientWidth || 900;

    if (hasMore && !loading && onLoadMore) {
      const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
      if (remaining <= 80 && lastLoadCount !== rows.length) {
        lastLoadCount = rows.length;
        onLoadMore();
      }
    }
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
    if (!target || editingCell || editingRowId) return;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "c" && cellSelection) {
      copySelectedCellsToClipboard();
      return;
    }
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

  const utilityColumnsCount = $derived(
    (rowReordering ? 1 : 0) +
      (detailPanel ? 1 : 0) +
      (checkboxSelection ? 1 : 0) +
      (showRowActions ? 1 : 0),
  );

  const visibleColumnsCount = $derived(leafHeaders.length + utilityColumnsCount);
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
      columns={activeColumns as unknown as CoimDataGridColumn<Record<string, unknown>>[]}
      columnVisibility={effectiveColumnVisibility}
      {groupable}
      {grouping}
      {enableExport}
      pivotable={Boolean(effectivePivotConfig)}
      pivotMode={pivotActive}
      {pivotPanelOpen}
      aiAssistantEnabled={enableAiAssistant || Boolean(aiProvider)}
      {aiAssistantOpen}
      {translate}
      onPivotToggle={togglePivotMode}
      onPivotPanelToggle={() => {
        pivotPanelOpen = !pivotPanelOpen;
      }}
      onAiAssistantToggle={() => {
        aiAssistantOpen = !aiAssistantOpen;
      }}
      onGlobalFilterChange={(val) => table.setGlobalFilter(val)}
      onColumnVisibilityToggle={(colId) => {
        columnVisibility = {
          ...columnVisibility,
          [colId]: effectiveColumnVisibility[colId] === false,
        };
      }}
      onGroupingChange={(next) => {
        grouping = next;
      }}
      onExportCsv={() =>
        downloadCsvExport(getExportRows(), activeColumns, { filename: `${exportFilename}.csv` })}
      onExportExcel={() => {
        void exportDataGridToExcel(getExportRows(), activeColumns, {
          filename: `${exportFilename}.xlsx`,
          sheetName: resolveDataGridLabel(translate, "data-grid-export-sheet-name"),
        });
      }}
      onPrint={() => printDataGrid(getExportRows(), activeColumns, resolvedAriaLabel)}
      actions={toolbarActions}
    />
  {/if}

  {#if errorMessage}
    <div role="alert" class="bg-error/10 text-error border-error/20 border-b px-4 py-2 text-sm">
      {errorMessage}
    </div>
  {/if}

  {#if aiAssistantOpen && (enableAiAssistant || aiProvider)}
    <CoimDataGridAiBar
      columns={columns as unknown as CoimDataGridColumn<Record<string, unknown>>[]}
      {aiProvider}
      {translate}
      onApplyResult={applyAiQueryResult}
      onReset={resetAiFilters}
      onClose={() => {
        aiAssistantOpen = false;
      }}
    />
  {/if}

  {#if pivotActive && pivotPanelOpen && effectivePivotConfig}
    <CoimDataGridPivotPanel
      columns={columns as unknown as CoimDataGridColumn<Record<string, unknown>>[]}
      config={effectivePivotConfig}
      {translate}
      onChange={updatePivotConfig}
      onClose={() => {
        pivotPanelOpen = false;
      }}
    />
  {/if}

{#snippet renderHeaderCell(header: (typeof visibleRenderHeaders)[number])}
  {@const colDef = columnLookup.get(header.column.id)}
  {@const colTitle = colDef?.headerName ?? header.column.id}
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
    scope="col"
    tabindex={0}
    data-col-id={header.column.id}
    aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
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
        aria-label={resolveDataGridLabel(translate, "data-grid-filter-column-aria", { column: colTitle })}
        value={(header.column.getFilterValue() as string) ?? ""}
        placeholder={resolveDataGridLabel(translate, "data-grid-filter-placeholder")}
        class="border-grey-200 bg-background-paper mt-1 w-full rounded border px-1.5 py-0.5 text-xs font-normal"
        oninput={(e) => {
          header.column.setFilterValue((e.currentTarget as HTMLInputElement).value);
        }}
      />
    {/if}

    {#if header.column.getCanResize()}
      <button
        type="button"
        aria-label={resolveDataGridLabel(translate, "data-grid-resize-column-aria", { column: colTitle })}
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
{/snippet}

{#snippet renderBodyCell(
  row: Row<typeof gridFeatures, TData>,
  cell: ReturnType<Row<typeof gridFeatures, TData>["getVisibleCells"]>[number],
)}
  {@const colDef = columnLookup.get(cell.column.id)}
  {@const rawValue = cell.getValue()}
  {@const pinned = cell.column.getIsPinned()}
  {@const pinStyle =
    pinned === "start"
      ? `inset-inline-start: ${cell.column.getStart("start")}px;`
      : pinned === "end"
        ? `inset-inline-end: ${cell.column.getAfter("end")}px;`
        : ""}
  {@const isRowEditing = showRowActions && editingRowId === row.id && Boolean(colDef?.editable)}
  {@const isEditing =
    isRowEditing ||
    (editMode !== "row" &&
      !pivotActive &&
      editingCell?.rowId === row.id &&
      editingCell?.columnId === cell.column.id)}
  {@const cellIsSelected = cellSelection && isCellSelected(row.id, cell.column.id)}
  <td
    role="gridcell"
    tabindex={0}
    data-col-id={cell.column.id}
    data-cell-selected={cellIsSelected ? "true" : undefined}
    style={`${pinStyle}`}
    class={cn(
      "coim-data-grid-cell",
      colDef?.align === "right" && "text-end",
      colDef?.align === "center" && "text-center",
      pinned === "start" && "coim-data-grid-cell-pinned-left",
      pinned === "end" && "coim-data-grid-cell-pinned-right",
    )}
    onclick={(e) => {
      selectGridCell(row.id, cell.column.id, {
        shiftKey: e.shiftKey,
        metaOrCtrl: e.metaKey || e.ctrlKey,
      });
    }}
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
          aria-label={resolveDataGridLabel(translate, "data-grid-edit-cell-aria", { column: colDef.headerName })}
          value={isRowEditing ? (rowEditDraft[cell.column.id] ?? "") : draftEditValue}
          class="border-primary bg-background-paper w-full rounded border px-1.5 py-0.5 text-sm"
          onclick={(e) => e.stopPropagation()}
          onchange={(e) => {
            const nextVal = (e.currentTarget as HTMLSelectElement).value;
            if (isRowEditing) rowEditDraft[cell.column.id] = nextVal;
            else draftEditValue = nextVal;
          }}
          onblur={() => {
            if (!isRowEditing) commitEdit(row, cell.column.id, rawValue);
          }}
          onkeydown={(e) => handleEditorKeyDown(e, row, cell.column.id, rawValue, isRowEditing)}
        >
          {#each colDef.options as opt (opt)}
            <option value={opt}>{opt}</option>
          {/each}
        </select>
      {:else if colDef?.type === "boolean"}
        <input
          type="checkbox"
          aria-label={resolveDataGridLabel(translate, "data-grid-edit-cell-aria", { column: colDef.headerName })}
          checked={isRowEditing ? rowEditDraft[cell.column.id] === "true" : draftEditValue === "true"}
          onclick={(e) => e.stopPropagation()}
          onchange={(e) => {
            const next = (e.currentTarget as HTMLInputElement).checked ? "true" : "false";
            if (isRowEditing) {
              rowEditDraft[cell.column.id] = next;
            } else {
              draftEditValue = next;
              commitEdit(row, cell.column.id, rawValue);
            }
          }}
          onblur={() => {
            if (!isRowEditing) commitEdit(row, cell.column.id, rawValue);
          }}
          onkeydown={(e) => {
            e.stopPropagation();
            if (e.key === "Escape") {
              e.preventDefault();
              if (isRowEditing) cancelRowEdit(row.id);
              else cancelEdit();
            }
          }}
        />
      {:else}
        <input
          type={colDef?.type === "number" ? "number" : colDef?.type === "date" ? "date" : "text"}
          aria-label={resolveDataGridLabel(translate, "data-grid-edit-cell-aria", { column: colDef?.headerName ?? cell.column.id })}
          value={isRowEditing ? (rowEditDraft[cell.column.id] ?? "") : draftEditValue}
          class="border-primary bg-background-paper w-full rounded border px-1.5 py-0.5 text-sm"
          onclick={(e) => e.stopPropagation()}
          oninput={(e) => {
            const nextVal = (e.currentTarget as HTMLInputElement).value;
            if (isRowEditing) rowEditDraft[cell.column.id] = nextVal;
            else draftEditValue = nextVal;
          }}
          onblur={() => {
            if (!isRowEditing) commitEdit(row, cell.column.id, rawValue);
          }}
          onkeydown={(e) => handleEditorKeyDown(e, row, cell.column.id, rawValue, isRowEditing)}
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
            aria-label={row.getIsExpanded()
              ? resolveDataGridLabel(translate, "data-grid-collapse-row-aria")
              : resolveDataGridLabel(translate, "data-grid-expand-row-aria")}
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
        {:else if colDef?.type === "boolean" && !colDef.valueFormatter}
          <span>
            {Boolean(rawValue)
              ? resolveDataGridLabel(translate, "data-grid-boolean-yes")
              : resolveDataGridLabel(translate, "data-grid-boolean-no")}
          </span>
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
{/snippet}

{#snippet renderDataRow(row: Row<typeof gridFeatures, TData>, pinnedSide?: "top" | "bottom")}
  {@const isSelected = row.getIsSelected()}
  {@const cellByColId = new Map(row.getVisibleCells().map((c) => [c.column.id, c]))}
  <tr
    aria-selected={checkboxSelection ? isSelected : undefined}
    data-pinned-row={pinnedSide}
    data-row-drag-id={rowReordering && !pinnedSide ? row.id : undefined}
    class="coim-data-grid-row"
    onclick={() => onRowClick?.(row.original, row.id)}
  >
    {#if rowReordering}
      <td class="coim-data-grid-cell">
        {#if !pinnedSide}
          <button
            type="button"
            data-row-drag-handle="true"
            aria-label={resolveDataGridLabel(translate, "data-grid-reorder-row-aria", { rowId: row.id })}
            title={resolveDataGridLabel(translate, "data-grid-reorder-row-title")}
            class="text-text-secondary hover:text-primary inline-flex h-6 w-6 cursor-grab items-center justify-center rounded active:cursor-grabbing"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => {
              if (e.altKey && e.key === "ArrowUp") {
                e.preventDefault();
                e.stopPropagation();
                moveRowByOffset(row.id, -1);
              } else if (e.altKey && e.key === "ArrowDown") {
                e.preventDefault();
                e.stopPropagation();
                moveRowByOffset(row.id, 1);
              }
            }}
          >
            <CiDragVertical size="small" />
          </button>
        {/if}
      </td>
    {/if}

    {#if detailPanel}
      <td class="coim-data-grid-cell">
        <button
          type="button"
          aria-expanded={Boolean(expandedDetailIds[row.id])}
          aria-label={resolveDataGridLabel(translate, "data-grid-toggle-details-aria", { rowId: row.id })}
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
          aria-label={resolveDataGridLabel(translate, "data-grid-select-row-aria", { rowId: row.id })}
          checked={isSelected}
          disabled={!row.getCanSelect()}
          onclick={(e) => e.stopPropagation()}
          onchange={row.getToggleSelectedHandler()}
        />
      </td>
    {/if}

    {#each columnSlice.startPinned as header (header.id)}
      {@const cell = cellByColId.get(header.column.id)}
      {#if cell}{@render renderBodyCell(row, cell)}{/if}
    {/each}

    {#if columnSlice.leftSpacerCols > 0}
      <td
        aria-hidden="true"
        colspan={columnSlice.leftSpacerCols}
        style={`width: ${columnSlice.leftSpacerWidth}px; padding: 0; border: 0;`}
      ></td>
    {/if}

    {#each columnSlice.middle as header (header.id)}
      {@const cell = cellByColId.get(header.column.id)}
      {#if cell}{@render renderBodyCell(row, cell)}{/if}
    {/each}

    {#if columnSlice.rightSpacerCols > 0}
      <td
        aria-hidden="true"
        colspan={columnSlice.rightSpacerCols}
        style={`width: ${columnSlice.rightSpacerWidth}px; padding: 0; border: 0;`}
      ></td>
    {/if}

    {#each columnSlice.endPinned as header (header.id)}
      {@const cell = cellByColId.get(header.column.id)}
      {#if cell}{@render renderBodyCell(row, cell)}{/if}
    {/each}

    {#if showRowActions}
      <td class="coim-data-grid-cell whitespace-nowrap text-end" onclick={(e) => e.stopPropagation()}>
        {#if !row.getIsGrouped()}
          {#if editingRowId === row.id}
            <div class="inline-flex items-center justify-end gap-1">
              <button
                type="button"
                aria-label={resolveDataGridLabel(translate, "data-grid-action-save-row-aria", { rowId: row.id })}
                title={resolveDataGridLabel(translate, "data-grid-action-save")}
                class="text-success hover:bg-success/10 inline-flex h-7 w-7 items-center justify-center rounded"
                onclick={() => commitRowEdit(row)}
              >
                <CiCheck size="small" />
              </button>
              <button
                type="button"
                aria-label={resolveDataGridLabel(translate, "data-grid-action-cancel-row-aria", { rowId: row.id })}
                title={resolveDataGridLabel(translate, "data-grid-action-cancel")}
                class="text-text-secondary hover:bg-grey-100 inline-flex h-7 w-7 items-center justify-center rounded"
                onclick={() => cancelRowEdit(row.id)}
              >
                <CiCross size="small" />
              </button>
            </div>
          {:else}
            <div class="inline-flex items-center justify-end gap-1">
              {#if editMode === "row"}
                <button
                  type="button"
                  aria-label={resolveDataGridLabel(translate, "data-grid-action-edit-row-aria", { rowId: row.id })}
                  title={resolveDataGridLabel(translate, "data-grid-action-edit")}
                  class="text-text-secondary hover:text-primary hover:bg-grey-100 inline-flex h-7 w-7 items-center justify-center rounded"
                  onclick={() => beginRowEdit(row)}
                >
                  <CiPen size="small" />
                </button>
              {/if}
              {#if onRowDelete}
                <button
                  type="button"
                  aria-label={resolveDataGridLabel(translate, "data-grid-action-delete-row-aria", { rowId: row.id })}
                  title={resolveDataGridLabel(translate, "data-grid-action-delete")}
                  class="text-text-secondary hover:text-error hover:bg-error/10 inline-flex h-7 w-7 items-center justify-center rounded"
                  onclick={() => onRowDelete?.(row.original, row.id)}
                >
                  <CiBinEmpty size="small" />
                </button>
              {/if}
            </div>
          {/if}
        {/if}
      </td>
    {/if}
  </tr>

  {#if detailPanel && expandedDetailIds[row.id]}
    <tr>
      <td colspan={visibleColumnsCount} class="coim-data-grid-detail-cell">
        {@render detailPanel({ row: row.original, rowId: row.id })}
      </td>
    </tr>
  {/if}
{/snippet}

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    bind:this={scrollEl}
    tabindex={0}
    role="region"
    aria-label={resolvedAriaLabel}
    class="coim-data-grid-scroll"
    style={virtualize ? `max-height: ${maxHeight};` : undefined}
    onscroll={handleScrollContainerScroll}
  >
    <table
      bind:this={tableEl}
      role="grid"
      aria-label={resolvedAriaLabel}
      aria-busy={loading || undefined}
      onkeydown={handleGridKeyDown}
      onpaste={handleTablePaste}
      class="coim-data-grid-table"
    >
      <thead class="coim-data-grid-head">
        {#if columnGroupHeaderCells.length > 0}
          <tr
            class="coim-data-grid-group-head"
            style={groupHeaderHeight ? `height: ${groupHeaderHeight}px;` : undefined}
          >
            {#if rowReordering}
              <th style="width: 40px;" aria-hidden="true"></th>
            {/if}
            {#if detailPanel}
              <th style="width: 44px;" aria-hidden="true"></th>
            {/if}
            {#if checkboxSelection}
              <th style="width: 44px;" aria-hidden="true"></th>
            {/if}
            {#each columnGroupHeaderCells as grp (grp.id)}
              <th
                colspan={grp.colSpan}
                class={cn(
                  grp.isGroup && "border-grey-100 border-s text-center first:border-s-0",
                )}
              >
                {#if grp.collapsible && grp.group}
                  <button
                    type="button"
                    aria-expanded={!grp.collapsed}
                    aria-label={grp.collapsed
                      ? resolveDataGridLabel(translate, "data-grid-expand-group-aria", { group: grp.headerName })
                      : resolveDataGridLabel(translate, "data-grid-collapse-group-aria", { group: grp.headerName })}
                    class="hover:text-primary inline-flex items-center justify-center gap-1 font-medium"
                    onclick={() => toggleColumnGroup(grp.group!)}
                  >
                    <span>{grp.headerName}</span>
                    {#if grp.collapsed}
                      <CiChevronRightSmall size="small" />
                    {:else}
                      <CiChevronDownSmall size="small" />
                    {/if}
                  </button>
                {:else}
                  {grp.headerName}
                {/if}
              </th>
            {/each}
            {#if showRowActions}
              <th style="width: 96px;" aria-hidden="true"></th>
            {/if}
          </tr>
        {/if}

        {#if headerGroups.length > 0}
          <tr>
            {#if rowReordering}
              <th style="width: 40px;" aria-label={resolveDataGridLabel(translate, "data-grid-reorder-column-aria")}></th>
            {/if}
            {#if detailPanel}
              <th style="width: 44px;" aria-label={resolveDataGridLabel(translate, "data-grid-expand-details-column-aria")}></th>
            {/if}
            {#if checkboxSelection}
              <th style="width: 44px;">
                {#if multiSelect}
                  <input
                    type="checkbox"
                    aria-label={resolveDataGridLabel(translate, "data-grid-select-all-aria")}
                    checked={allSelectedOnGrid}
                    onchange={table.getToggleAllRowsSelectedHandler()}
                  />
                {/if}
              </th>
            {/if}

            {#each columnSlice.startPinned as header (header.id)}
              {@render renderHeaderCell(header)}
            {/each}

            {#if columnSlice.leftSpacerCols > 0}
              <th
                aria-hidden="true"
                colspan={columnSlice.leftSpacerCols}
                style={`width: ${columnSlice.leftSpacerWidth}px; padding: 0; border: 0;`}
              ></th>
            {/if}

            {#each columnSlice.middle as header (header.id)}
              {@render renderHeaderCell(header)}
            {/each}

            {#if columnSlice.rightSpacerCols > 0}
              <th
                aria-hidden="true"
                colspan={columnSlice.rightSpacerCols}
                style={`width: ${columnSlice.rightSpacerWidth}px; padding: 0; border: 0;`}
              ></th>
            {/if}

            {#each columnSlice.endPinned as header (header.id)}
              {@render renderHeaderCell(header)}
            {/each}

            {#if showRowActions}
              <th
                style="width: 96px;"
                class="text-end"
                aria-label={resolveDataGridLabel(translate, "data-grid-actions-column-aria")}
              >
                <span class="font-bold">{resolveDataGridLabel(translate, "data-grid-actions-header")}</span>
              </th>
            {/if}
          </tr>
        {/if}
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
        {:else if topPinnedRows.length === 0 && unpinnedRows.length === 0 && bottomPinnedRows.length === 0}
          <tr>
            <td colspan={visibleColumnsCount} class="coim-data-grid-cell text-text-secondary py-8 text-center">
              {resolvedEmptyMessage}
            </td>
          </tr>
        {:else}
          {#each topPinnedRows as row (`pin-top-${row.id}`)}
            {@render renderDataRow(row, "top")}
          {/each}

          {@const virtualItems = virtualize ? $virtualizer.getVirtualItems() : null}
          {@const rowsToRender =
            virtualItems && virtualItems.length > 0
              ? virtualItems.map((vi) => unpinnedRows[vi.index]).filter(Boolean)
              : unpinnedRows}
          {#if virtualItems && virtualItems.length > 0 && virtualItems[0].start > 0}
            <tr aria-hidden="true">
              <td colspan={visibleColumnsCount} style={`height: ${virtualItems[0].start}px; padding: 0; border: 0;`}></td>
            </tr>
          {/if}

          {#each rowsToRender as row (row.id)}
            {@render renderDataRow(row)}
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

          {#each bottomPinnedRows as row (`pin-bottom-${row.id}`)}
            {@render renderDataRow(row, "bottom")}
          {/each}
        {/if}
      </tbody>

      {#if renderSummaryRow}
        <tfoot>
          <tr
            class="coim-data-grid-summary-row"
            aria-label={resolveDataGridLabel(translate, "data-grid-summary-row-aria")}
          >
            {#if rowReordering}
              <td class="coim-data-grid-cell"></td>
            {/if}
            {#if detailPanel}
              <td class="coim-data-grid-cell"></td>
            {/if}
            {#if checkboxSelection}
              <td class="coim-data-grid-cell"></td>
            {/if}

            {#each columnSlice.startPinned as header (header.id)}
              {@const colDef = columnLookup.get(header.column.id)}
              <td
                class={cn(
                  "coim-data-grid-cell",
                  colDef?.align === "right" && "text-end",
                  colDef?.align === "center" && "text-center",
                )}
              >
                {colDef ? computeSummaryText(colDef) : ""}
              </td>
            {/each}

            {#if columnSlice.leftSpacerCols > 0}
              <td aria-hidden="true" colspan={columnSlice.leftSpacerCols} style="padding: 0; border: 0;"></td>
            {/if}

            {#each columnSlice.middle as header (header.id)}
              {@const colDef = columnLookup.get(header.column.id)}
              <td
                class={cn(
                  "coim-data-grid-cell",
                  colDef?.align === "right" && "text-end",
                  colDef?.align === "center" && "text-center",
                )}
              >
                {colDef ? computeSummaryText(colDef) : ""}
              </td>
            {/each}

            {#if columnSlice.rightSpacerCols > 0}
              <td aria-hidden="true" colspan={columnSlice.rightSpacerCols} style="padding: 0; border: 0;"></td>
            {/if}

            {#each columnSlice.endPinned as header (header.id)}
              {@const colDef = columnLookup.get(header.column.id)}
              <td
                class={cn(
                  "coim-data-grid-cell",
                  colDef?.align === "right" && "text-end",
                  colDef?.align === "center" && "text-center",
                )}
              >
                {colDef ? computeSummaryText(colDef) : ""}
              </td>
            {/each}

            {#if showRowActions}
              <td class="coim-data-grid-cell"></td>
            {/if}
          </tr>
        </tfoot>
      {/if}
    </table>
  </div>

  <div class="coim-data-grid-footer">
    <div class="text-text-secondary flex items-center gap-2">
      <span>{resolveDataGridLabel(translate, "data-grid-total-rows", { count: totalFilteredCount })}</span>
      {#if selectedRowIds.length > 0}
        <span class="text-primary font-medium">
          · {resolveDataGridLabel(translate, "data-grid-selected-count", { count: selectedRowIds.length })}
        </span>
      {/if}
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <label class="flex items-center gap-1.5">
        <span class="text-text-secondary">{resolveDataGridLabel(translate, "data-grid-rows-label")}</span>
        <select
          aria-label={resolveDataGridLabel(translate, "data-grid-rows-per-page-aria")}
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

      <span class="text-text-secondary">
        {resolveDataGridLabel(translate, "data-grid-page-of", { page: page + 1, totalPages })}
      </span>

      <div class="flex items-center gap-1">
        <button
          type="button"
          aria-label={resolveDataGridLabel(translate, "data-grid-first-page-aria")}
          disabled={!table.getCanPreviousPage()}
          class="hover:bg-grey-50 disabled:opacity-disabled rounded p-1"
          onclick={() => table.firstPage()}
        >
          <CiEndLeftSmall size="small" />
        </button>
        <button
          type="button"
          aria-label={resolveDataGridLabel(translate, "data-grid-previous-page-aria")}
          disabled={!table.getCanPreviousPage()}
          class="hover:bg-grey-50 disabled:opacity-disabled rounded p-1"
          onclick={() => table.previousPage()}
        >
          <CiChevronLeftSmall size="small" />
        </button>
        <button
          type="button"
          aria-label={resolveDataGridLabel(translate, "data-grid-next-page-aria")}
          disabled={!table.getCanNextPage()}
          class="hover:bg-grey-50 disabled:opacity-disabled rounded p-1"
          onclick={() => table.nextPage()}
        >
          <CiChevronRightSmall size="small" />
        </button>
        <button
          type="button"
          aria-label={resolveDataGridLabel(translate, "data-grid-last-page-aria")}
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
