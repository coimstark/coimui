import type { TranslateFn } from "../layouts/types.js";
import { resolveDataGridLabel } from "./i18n.js";
import type {
  CoimDataGridAggregationFn,
  CoimDataGridColumn,
  CoimDataGridColumnGroup,
  CoimDataGridPivotConfig,
} from "./types.js";

export interface CoimPivotResult {
  rows: Record<string, unknown>[];
  columns: CoimDataGridColumn<Record<string, unknown>>[];
  columnGroups: CoimDataGridColumnGroup[];
}

export interface CoimPivotTableOptions {
  translate?: TranslateFn;
}

function readFieldValue<TData extends Record<string, unknown>>(
  row: TData,
  field: string,
  colMap: Map<string, CoimDataGridColumn<TData>>,
): unknown {
  const col = colMap.get(field);
  if (col?.valueGetter) return col.valueGetter(row);
  if (col?.field) return row[col.field];
  return row[field];
}

function aggregateNumbers(values: number[], fn: CoimDataGridAggregationFn): number {
  if (fn === "count") return values.length;
  if (values.length === 0) return 0;
  if (fn === "min") return Math.min(...values);
  if (fn === "max") return Math.max(...values);
  const sum = values.reduce((acc, n) => acc + n, 0);
  if (fn === "mean") return Math.round((sum / values.length) * 100) / 100;
  return sum;
}

/** Transforms tabular rows into a grouped pivot matrix with dynamic value columns and optional totals. */
export function buildPivotTable<TData extends Record<string, unknown>>(
  rows: TData[],
  columns: CoimDataGridColumn<TData>[],
  config: CoimDataGridPivotConfig,
  options?: CoimPivotTableOptions,
): CoimPivotResult {
  const translate = options?.translate;
  const colMap = new Map(columns.map((c) => [c.id, c]));
  const aggFn: CoimDataGridAggregationFn = config.aggregationFn ?? "sum";
  const pivotSourceCol = colMap.get(config.columnField);
  const valueSourceCol = colMap.get(config.valueField);

  const distinctColVals = Array.from(
    new Set(
      rows
        .map((r) => readFieldValue(r, config.columnField, colMap))
        .filter((v) => v !== null && v !== undefined && String(v) !== "")
        .map((v) => String(v)),
    ),
  ).sort((a, b) => a.localeCompare(b));

  const pivotColKeyMap = new Map<string, string>();
  distinctColVals.forEach((val, idx) => pivotColKeyMap.set(val, `__pivot_${idx}`));

  const rowGroups = new Map<string, { keyVals: unknown[]; entries: TData[] }>();
  for (const row of rows) {
    const keyVals = config.rowFields.map((rf) => readFieldValue(row, rf, colMap));
    const composite = keyVals.map((v) => String(v ?? "")).join("\u0000");
    let group = rowGroups.get(composite);
    if (!group) {
      group = { keyVals, entries: [] };
      rowGroups.set(composite, group);
    }
    group.entries.push(row);
  }

  const pivotRows: Record<string, unknown>[] = [];
  let rowIdx = 0;
  for (const grp of rowGroups.values()) {
    const out: Record<string, unknown> = { id: `pivot-${rowIdx++}` };
    config.rowFields.forEach((rf, i) => {
      out[rf] = grp.keyVals[i] ?? "";
    });

    const allGroupNums: number[] = [];
    for (const colVal of distinctColVals) {
      const colKey = pivotColKeyMap.get(colVal)!;
      const matching = grp.entries.filter(
        (r) => String(readFieldValue(r, config.columnField, colMap) ?? "") === colVal,
      );
      if (aggFn === "count") {
        out[colKey] = matching.length;
        allGroupNums.push(matching.length);
      } else {
        const nums = matching
          .map((r) => Number(readFieldValue(r, config.valueField, colMap)))
          .filter((n) => Number.isFinite(n));
        out[colKey] = nums.length > 0 ? aggregateNumbers(nums, aggFn) : 0;
        allGroupNums.push(...nums);
      }
    }

    if (config.showRowTotals !== false) {
      out.__pivot_total =
        aggFn === "count" ? grp.entries.length : aggregateNumbers(allGroupNums, aggFn);
    }
    pivotRows.push(out);
  }

  const rowColumns: CoimDataGridColumn<Record<string, unknown>>[] = config.rowFields.map((rf) => {
    const src = colMap.get(rf);
    return {
      id: rf,
      field: rf,
      headerName: src?.headerName ?? rf,
      width: src?.width ?? 150,
      sortable: true,
      filterable: true,
      valueFormatter: src?.valueFormatter as
        | ((value: unknown, row: Record<string, unknown>) => string)
        | undefined,
    };
  });

  const metricCols: CoimDataGridColumn<Record<string, unknown>>[] = distinctColVals.map((colVal) => {
    const colKey = pivotColKeyMap.get(colVal)!;
    return {
      id: colKey,
      field: colKey,
      headerName: colVal,
      type: "number",
      align: "right",
      width: 130,
      aggregationFn: aggFn === "count" ? "sum" : aggFn,
      valueFormatter:
        aggFn === "count"
          ? undefined
          : (valueSourceCol?.valueFormatter as
              | ((value: unknown, row: Record<string, unknown>) => string)
              | undefined),
    };
  });

  if (config.showRowTotals !== false) {
    metricCols.push({
      id: "__pivot_total",
      field: "__pivot_total",
      headerName: resolveDataGridLabel(translate, "data-grid-pivot-total"),
      type: "number",
      align: "right",
      width: 130,
      aggregationFn: aggFn === "count" ? "sum" : aggFn,
      valueFormatter:
        aggFn === "count"
          ? undefined
          : (valueSourceCol?.valueFormatter as
              | ((value: unknown, row: Record<string, unknown>) => string)
              | undefined),
    });
  }

  const aggLabel = resolveDataGridLabel(translate, `data-grid-pivot-agg-${aggFn}`);
  const columnGroups: CoimDataGridColumnGroup[] = metricCols.length
    ? [
        {
          id: "pivot-columns-group",
          headerName: resolveDataGridLabel(translate, "data-grid-pivot-group-header", {
            value: valueSourceCol?.headerName ?? config.valueField,
            aggregation: aggLabel,
            column: pivotSourceCol?.headerName ?? config.columnField,
          }),
          children: metricCols.map((c) => c.id),
        },
      ]
    : [];

  return {
    rows: pivotRows,
    columns: [...rowColumns, ...metricCols],
    columnGroups,
  };
}
