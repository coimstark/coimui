import { getContext, hasContext, setContext } from "svelte";

export type TableSize = "medium" | "small";
export type TablePadding = "normal" | "checkbox" | "none";
export type TableSection = "head" | "body" | "footer";
export type AriaSortDirection = "ascending" | "descending";

export interface TableContextValue {
  readonly size: TableSize;
  readonly stickyHeader: boolean;
  readonly padding: TablePadding;
}

export interface TableCellSortContextValue {
  setSortDirection: (direction: AriaSortDirection | undefined) => void;
}

const TABLE_CONTEXT_KEY = Symbol("coim-table");
const TABLE_SECTION_CONTEXT_KEY = Symbol("coim-table-section");
const TABLE_CELL_SORT_CONTEXT_KEY = Symbol("coim-table-cell-sort");

export function setTableContext(value: TableContextValue): TableContextValue {
  return setContext(TABLE_CONTEXT_KEY, value);
}

export function tryGetTableContext(): TableContextValue | undefined {
  if (!hasContext(TABLE_CONTEXT_KEY)) return undefined;
  return getContext<TableContextValue>(TABLE_CONTEXT_KEY);
}

export function setTableSectionContext(section: TableSection): TableSection {
  return setContext(TABLE_SECTION_CONTEXT_KEY, section);
}

export function tryGetTableSectionContext(): TableSection | undefined {
  if (!hasContext(TABLE_SECTION_CONTEXT_KEY)) return undefined;
  return getContext<TableSection>(TABLE_SECTION_CONTEXT_KEY);
}

export function setTableCellSortContext(
  value: TableCellSortContextValue,
): TableCellSortContextValue {
  return setContext(TABLE_CELL_SORT_CONTEXT_KEY, value);
}

export function tryGetTableCellSortContext(): TableCellSortContextValue | undefined {
  if (!hasContext(TABLE_CELL_SORT_CONTEXT_KEY)) return undefined;
  return getContext<TableCellSortContextValue>(TABLE_CELL_SORT_CONTEXT_KEY);
}
