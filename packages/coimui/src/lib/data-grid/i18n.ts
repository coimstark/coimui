import type { TranslateFn } from "../layouts/types.js";

/**
 * Human-readable English fallbacks for built-in CoimDataGrid keys so consumer apps
 * without custom i18n dictionaries never expose raw key slugs.
 */
export const DEFAULT_DATA_GRID_LABELS: Record<string, string> = {
  "data-grid-aria-label": "Data grid",
  "data-grid-empty": "No records found.",
  "data-grid-boolean-yes": "Yes",
  "data-grid-boolean-no": "No",
  "data-grid-export-sheet-name": "Data",
  "data-grid-search-placeholder": "Search...",
  "data-grid-search-aria-label": "Search rows",
  "data-grid-group-label": "Group:",
  "data-grid-group-aria-label": "Group by column",
  "data-grid-group-none": "None",
  "data-grid-ai-assistant": "AI Assistant",
  "data-grid-pivot": "Pivot",
  "data-grid-pivot-fields": "Pivot Fields",
  "data-grid-columns": "Columns",
  "data-grid-columns-toggle-aria": "Toggle columns",
  "data-grid-density-aria": "Row density",
  "data-grid-density-compact": "Compact",
  "data-grid-density-standard": "Standard",
  "data-grid-density-comfortable": "Comfortable",
  "data-grid-export-csv": "CSV",
  "data-grid-export-excel": "Excel",
  "data-grid-export-print": "Print",
  "data-grid-filter-placeholder": "Filter...",
  "data-grid-filter-column-aria": "Filter {column}",
  "data-grid-resize-column-aria": "Resize {column} column",
  "data-grid-expand-group-aria": "Expand group {group}",
  "data-grid-collapse-group-aria": "Collapse group {group}",
  "data-grid-select-all-aria": "Select all rows",
  "data-grid-select-row-aria": "Select row {rowId}",
  "data-grid-reorder-column-aria": "Reorder row",
  "data-grid-reorder-row-aria": "Reorder row {rowId}",
  "data-grid-reorder-row-title": "Drag or Alt+ArrowUp/Down to reorder",
  "data-grid-expand-details-column-aria": "Expand details",
  "data-grid-toggle-details-aria": "Toggle details for row {rowId}",
  "data-grid-expand-row-aria": "Expand row",
  "data-grid-collapse-row-aria": "Collapse row",
  "data-grid-edit-cell-aria": "Edit {column}",
  "data-grid-actions-header": "Actions",
  "data-grid-actions-column-aria": "Row actions",
  "data-grid-action-edit": "Edit",
  "data-grid-action-edit-row-aria": "Edit row {rowId}",
  "data-grid-action-save": "Save",
  "data-grid-action-save-row-aria": "Save row {rowId}",
  "data-grid-action-cancel": "Cancel",
  "data-grid-action-cancel-row-aria": "Cancel row {rowId}",
  "data-grid-action-delete": "Delete",
  "data-grid-action-delete-row-aria": "Delete row {rowId}",
  "data-grid-summary-row-aria": "Summary row",
  "data-grid-agg-count": "Count",
  "data-grid-agg-sum": "Sum",
  "data-grid-agg-min": "Min",
  "data-grid-agg-max": "Max",
  "data-grid-agg-mean": "Mean",
  "data-grid-agg-avg": "Avg",
  "data-grid-summary-format": "{label}: {value}",
  "data-grid-pivot-total": "Total",
  "data-grid-pivot-agg-count": "count",
  "data-grid-pivot-agg-sum": "sum",
  "data-grid-pivot-agg-min": "min",
  "data-grid-pivot-agg-max": "max",
  "data-grid-pivot-agg-mean": "mean",
  "data-grid-pivot-group-header": "{value} ({aggregation}) by {column}",
  "data-grid-total-rows": "{count} total row(s)",
  "data-grid-selected-count": "{count} selected",
  "data-grid-rows-label": "Rows:",
  "data-grid-rows-per-page-aria": "Rows per page",
  "data-grid-page-of": "Page {page} of {totalPages}",
  "data-grid-first-page-aria": "First page",
  "data-grid-previous-page-aria": "Previous page",
  "data-grid-next-page-aria": "Next page",
  "data-grid-last-page-aria": "Last page",
  "data-grid-close": "Close",
  "data-grid-pivot-panel-aria": "Pivot field configurator",
  "data-grid-pivot-panel-title": "Pivot Field Configurator",
  "data-grid-pivot-panel-subtitle":
    "Drag fields or use controls to configure rows, columns, and aggregations",
  "data-grid-pivot-close-aria": "Close pivot field configurator",
  "data-grid-pivot-available-fields": "Available Fields:",
  "data-grid-pivot-row-fields-aria": "Row fields",
  "data-grid-pivot-row-fields": "Row Fields",
  "data-grid-pivot-move-up-aria": "Move {field} up",
  "data-grid-pivot-move-down-aria": "Move {field} down",
  "data-grid-pivot-remove-row-field-aria": "Remove row field {field}",
  "data-grid-pivot-add-row-field-aria": "Add row field",
  "data-grid-pivot-add-row-field-placeholder": "Add row field...",
  "data-grid-pivot-confirm-add-row-field-aria": "Confirm add row field",
  "data-grid-pivot-column-field-dropzone-aria": "Column field dropzone",
  "data-grid-pivot-column-field": "Column Field",
  "data-grid-pivot-column-field-aria": "Pivot column field",
  "data-grid-pivot-value-field": "Value Field",
  "data-grid-pivot-value-field-aria": "Pivot value field",
  "data-grid-pivot-aggregation": "Aggregation",
  "data-grid-pivot-aggregation-aria": "Pivot aggregation",
  "data-grid-pivot-show-row-totals-aria": "Show pivot row totals",
  "data-grid-pivot-show-row-totals": "Show row totals",
  "data-grid-ai-region-aria": "Data grid AI assistant",
  "data-grid-ai-config-required": "Configuration Required",
  "data-grid-ai-close-aria": "Close AI assistant",
  "data-grid-ai-not-configured":
    "AI provider not configured. Supply an aiProvider adapter implementing CoimDataGridAiProvider to run natural-language filtering, sorting, grouping, or pivot queries.",
  "data-grid-ai-prompt-aria": "AI query prompt",
  "data-grid-ai-prompt-placeholder": "Ask your provider to filter, sort, group, or pivot rows...",
  "data-grid-ai-prompt-disabled-placeholder":
    "AI prompt disabled until an aiProvider is configured",
  "data-grid-ai-running": "Running...",
  "data-grid-ai-apply": "Apply Prompt",
  "data-grid-ai-reset-aria": "Reset AI filters",
  "data-grid-ai-reset": "Reset",
  "data-grid-ai-applied-summary": "Applied query from {provider}.",
  "data-grid-ai-error-fallback": "Failed to execute AI query.",
};

/**
 * Resolves a localized DataGrid label via `translate(key)` with fallback to English
 * defaults and optional `{param}` interpolation.
 */
export function resolveDataGridLabel(
  translate: TranslateFn | undefined,
  key: string,
  params?: Record<string, string | number>,
): string {
  const translated = translate ? translate(key) : key;
  let resolved = translated && translated !== key ? translated : (DEFAULT_DATA_GRID_LABELS[key] ?? key);
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      resolved = resolved.replaceAll(`{${paramKey}}`, String(paramValue));
    }
  }
  return resolved;
}
