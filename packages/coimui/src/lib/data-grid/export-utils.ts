import Papa from "papaparse";
import type { CoimDataGridColumn, CoimDataGridExportOptions } from "./types.js";

function resolveColumnRawValue<TData extends Record<string, unknown>>(
  row: TData,
  col: CoimDataGridColumn<TData>,
): unknown {
  if (col.valueGetter) return col.valueGetter(row);
  if (col.field) return row[col.field];
  return row[col.id];
}

function formatColumnValue<TData extends Record<string, unknown>>(
  row: TData,
  col: CoimDataGridColumn<TData>,
): string {
  const raw = resolveColumnRawValue(row, col);
  if (col.valueFormatter) return col.valueFormatter(raw, row);
  if (raw === null || raw === undefined) return "";
  if (raw instanceof Date) return raw.toISOString();
  return String(raw);
}

export function buildCsvContent<TData extends Record<string, unknown>>(
  rows: TData[],
  columns: CoimDataGridColumn<TData>[],
  options: CoimDataGridExportOptions = {},
): string {
  const includeHeaders = options.includeHeaders ?? true;
  const exportable = columns.filter((col) => col.type !== "actions");

  const dataRows = rows.map((row) => exportable.map((col) => formatColumnValue(row, col)));
  if (includeHeaders) {
    return Papa.unparse({
      fields: exportable.map((c) => c.headerName),
      data: dataRows,
    });
  }
  return Papa.unparse(dataRows);
}

export function downloadCsvExport<TData extends Record<string, unknown>>(
  rows: TData[],
  columns: CoimDataGridColumn<TData>[],
  options: CoimDataGridExportOptions = {},
): string {
  const csv = buildCsvContent(rows, columns, options);
  if (typeof window !== "undefined" && (options.download ?? true)) {
    const filename = options.filename ?? "coimui-data-export.csv";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
  return csv;
}

export async function exportDataGridToExcel<TData extends Record<string, unknown>>(
  rows: TData[],
  columns: CoimDataGridColumn<TData>[],
  options: CoimDataGridExportOptions = {},
): Promise<ArrayBuffer> {
  const ExcelJS = await import("exceljs");
  const Workbook = ExcelJS.Workbook ?? (ExcelJS as unknown as { default: typeof ExcelJS }).default.Workbook;
  const workbook = new Workbook();
  const sheet = workbook.addWorksheet(options.sheetName ?? "Data");
  const exportable = columns.filter((col) => col.type !== "actions");

  sheet.columns = exportable.map((col) => ({
    header: col.headerName,
    key: col.id,
    width: Math.max(12, Math.round((col.width ?? 140) / 8)),
  }));

  for (const row of rows) {
    const record: Record<string, unknown> = {};
    for (const col of exportable) {
      record[col.id] = formatColumnValue(row, col);
    }
    sheet.addRow(record);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const arrayBuffer =
    buffer instanceof ArrayBuffer
      ? buffer
      : (buffer as Uint8Array).buffer.slice(
          (buffer as Uint8Array).byteOffset,
          (buffer as Uint8Array).byteOffset + (buffer as Uint8Array).byteLength,
        );

  if (typeof window !== "undefined" && (options.download ?? true)) {
    const filename = options.filename ?? "coimui-data-export.xlsx";
    const blob = new Blob([new Uint8Array(arrayBuffer as ArrayBuffer)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return arrayBuffer as ArrayBuffer;
}

export function printDataGrid<TData extends Record<string, unknown>>(
  rows: TData[],
  columns: CoimDataGridColumn<TData>[],
  title = "Data Export",
): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const exportable = columns.filter((col) => col.type !== "actions");
  const esc = (v: string) =>
    v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const headerCells = exportable.map((c) => `<th>${esc(c.headerName)}</th>`).join("");
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${exportable.map((c) => `<td>${esc(formatColumnValue(row, c))}</td>`).join("")}</tr>`,
    )
    .join("");

  const html = `<!doctype html><html><head><title>${esc(title)}</title><style>body{font-family:sans-serif;padding:24px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #d1d5db;padding:8px;text-align:left;font-size:12px;}th{background:#f3f4f6;}</style></head><body><h1>${esc(title)}</h1><table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></body></html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);
  const doc = iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  }
  setTimeout(() => iframe.remove(), 500);
}
