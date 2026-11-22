import type { Snippet } from "svelte";

export type CoimDataGridDensity = "compact" | "standard" | "comfortable";
export type CoimDataGridColumnType = "string" | "number" | "date" | "boolean" | "actions";
export type CoimDataGridPinSide = "left" | "right" | false;
export type CoimDataGridAggregationFn = "count" | "sum" | "min" | "max" | "mean";

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
