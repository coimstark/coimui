import type { Snippet } from "svelte";

export type CoimDataGridDensity = "compact" | "standard" | "comfortable";
export type CoimDataGridColumnType = "string" | "number" | "date" | "boolean" | "actions";
export type CoimDataGridPinSide = "left" | "right" | false;
export type CoimDataGridAggregationFn = "count" | "sum" | "min" | "max" | "mean";
export type CoimDataGridEditMode = "cell" | "row";

export interface CoimDataGridColumnGroup {
  id: string;
  headerName: string;
  children: string[];
  collapsible?: boolean;
  collapsibleColumns?: string[];
  defaultCollapsed?: boolean;
}

export interface CoimDataGridPivotConfig {
  rowFields: string[];
  columnField: string;
  valueField: string;
  aggregationFn?: CoimDataGridAggregationFn;
  showRowTotals?: boolean;
}

export interface CoimDataGridAiQueryRequest {
  prompt: string;
  columns: {
    id: string;
    headerName: string;
    type?: CoimDataGridColumnType;
    options?: string[];
  }[];
}

export interface CoimDataGridAiQueryResult {
  summary?: string;
  globalFilter?: string;
  columnFilters?: { id: string; value: unknown }[];
  sorting?: CoimDataGridSortItem[];
  grouping?: string[];
  pivotConfig?: CoimDataGridPivotConfig;
}

export interface CoimDataGridAiProvider {
  id: string;
  label: string;
  executeQuery: (request: CoimDataGridAiQueryRequest) => Promise<CoimDataGridAiQueryResult>;
}

export interface CoimDataGridPivotPanelProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: CoimDataGridColumn<TData>[];
  config: CoimDataGridPivotConfig;
  onChange: (next: CoimDataGridPivotConfig) => void;
  onClose?: () => void;
}

export interface CoimDataGridAiBarProps<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  columns: CoimDataGridColumn<TData>[];
  aiProvider?: CoimDataGridAiProvider;
  onApplyResult: (result: CoimDataGridAiQueryResult) => void;
  onReset?: () => void;
  onClose?: () => void;
}

export interface CoimDataGridRowEditEvent<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  rowId: string;
  row: TData;
  previousRow: TData;
  changedFields: string[];
}

export interface CoimDataGridPinnedRows {
  top?: string[];
  bottom?: string[];
}

export interface CoimDataGridCellCoord {
  rowId: string;
  columnId: string;
}

export interface CoimDataGridColumn<TData extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  field?: keyof TData & string;
  headerName: string;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  type?: CoimDataGridColumnType;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  hideable?: boolean;
  resizable?: boolean;
  groupable?: boolean;
  align?: "left" | "center" | "right";
  pinned?: CoimDataGridPinSide;
  options?: string[];
  aggregationFn?: CoimDataGridAggregationFn;
  valueGetter?: (row: TData) => unknown;
  valueFormatter?: (value: unknown, row: TData) => string;
  renderCell?: Snippet<
    [
      {
        value: unknown;
        row: TData;
        rowId: string;
        column: CoimDataGridColumn<TData>;
      },
    ]
  >;
}

export interface CoimDataGridSortItem {
  id: string;
  desc: boolean;
}

export interface CoimDataGridCellEditEvent<
  TData extends Record<string, unknown> = Record<string, unknown>,
> {
  row: TData;
  rowId: string;
  columnId: string;
  value: unknown;
  previousValue: unknown;
}

export interface CoimDataGridPersistedState {
  columnVisibility: Record<string, boolean>;
  columnOrder: string[];
  columnSizing: Record<string, number>;
  columnPinning: { left?: string[]; right?: string[] };
  sorting: CoimDataGridSortItem[];
  density: CoimDataGridDensity;
  pageSize: number;
}

export interface CoimDataGridExportOptions {
  filename?: string;
  sheetName?: string;
  includeHeaders?: boolean;
  selectedOnly?: boolean;
  download?: boolean;
}

export interface CoimDataGridProps<TData extends Record<string, unknown> = Record<string, unknown>> {
  rows: TData[];
  columns: CoimDataGridColumn<TData>[];
  getRowId?: (row: TData, index: number) => string;
  getSubRows?: (row: TData) => TData[] | undefined;
  paginationMode?: "client" | "server";
  sortingMode?: "client" | "server";
  filterMode?: "client" | "server";
  rowCount?: number;
  page?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  checkboxSelection?: boolean;
  multiSelect?: boolean;
  selectedRowIds?: string[];
  density?: CoimDataGridDensity;
  showToolbar?: boolean;
  showColumnFilters?: boolean;
  groupable?: boolean;
  virtualize?: boolean;
  estimateRowHeight?: number;
  maxHeight?: string;
  loading?: boolean;
  errorMessage?: string;
  emptyMessage?: string;
  storageKey?: string;
  enableExport?: boolean;
  exportFilename?: string;
  ariaLabel?: string;
  columnGroups?: CoimDataGridColumnGroup[];
  groupHeaderHeight?: number;
  editMode?: CoimDataGridEditMode;
  onRowEditCommit?: (event: CoimDataGridRowEditEvent<TData>) => void;
  onRowEditCancel?: (rowId: string) => void;
  onRowDelete?: (row: TData, rowId: string) => void;
  pivotMode?: boolean;
  pivotConfig?: CoimDataGridPivotConfig;
  onPivotModeChange?: (enabled: boolean) => void;
  onPivotConfigChange?: (config: CoimDataGridPivotConfig) => void;
  enableAiAssistant?: boolean;
  aiProvider?: CoimDataGridAiProvider;
  onAiQueryApplied?: (result: CoimDataGridAiQueryResult) => void;
  showSummaryRow?: boolean;
  pinnedRows?: CoimDataGridPinnedRows;
  rowReordering?: boolean;
  onRowOrderChange?: (orderedIds: string[], reorderedRows: TData[]) => void;
  cellSelection?: boolean;
  selectedCells?: CoimDataGridCellCoord[];
  onCellSelectionChange?: (cells: CoimDataGridCellCoord[]) => void;
  enableClipboardPaste?: boolean;
  onClipboardPaste?: (updates: CoimDataGridCellEditEvent<TData>[]) => void;
  hasMore?: boolean;
  onLoadMore?: () => void;
  virtualizeColumns?: boolean;
  columnOverscan?: number;
  detailPanel?: Snippet<[{ row: TData; rowId: string }]>;
  toolbarActions?: Snippet;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onSortChange?: (sorting: CoimDataGridSortItem[]) => void;
  onFilterChange?: (filters: { globalFilter: string; columnFilters: { id: string; value: unknown }[] }) => void;
  onSelectionChange?: (selectedIds: string[], selectedRows: TData[]) => void;
  onCellEditCommit?: (event: CoimDataGridCellEditEvent<TData>) => void;
  onRowClick?: (row: TData, rowId: string) => void;
  class?: string;
}
