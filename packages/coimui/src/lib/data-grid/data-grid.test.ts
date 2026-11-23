import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
import CoimDataGrid from "./CoimDataGrid.svelte";
import { buildCsvContent, exportDataGridToExcel } from "./export-utils.js";
import { buildPivotTable } from "./pivot-utils.js";
import type { CoimDataGridColumn, CoimDataGridColumnGroup } from "./types.js";

interface RowItem extends Record<string, unknown> {
  id: string;
  name: string;
  department: string;
  revenue: number;
}

const sampleRows: RowItem[] = [
  { id: "1", name: "Alice", department: "Engineering", revenue: 3200 },
  { id: "2", name: "Bob", department: "Sales", revenue: 1800 },
  { id: "3", name: "Charlie", department: "Engineering", revenue: 4900 },
  { id: "4", name: "Diana", department: "Design", revenue: 2700 },
];

const sampleColumns: CoimDataGridColumn<RowItem>[] = [
  { id: "name", field: "name", headerName: "Name", editable: true, width: 160 },
  { id: "department", field: "department", headerName: "Department", width: 140 },
  { id: "revenue", field: "revenue", headerName: "Revenue", type: "number", align: "right", width: 120 },
];

describe("CoimDataGrid", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  it("supports sorting, quick search filtering, and pagination", async () => {
    const view = render(CoimDataGrid, {
      props: {
        rows: sampleRows,
        columns: sampleColumns as unknown as CoimDataGridColumn[],
        pageSize: 2,
        pageSizeOptions: [2, 5, 10],
      },
    });
    await tick();

    // First page shows 2 rows
    expect(view.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(view.getByText("Alice")).toBeInTheDocument();
    expect(view.queryByText("Charlie")).toBeNull();

    // Sort by Revenue ascending -> Bob (1800), then descending -> Charlie (4900)
    const revHeaderBtn = view.getByRole("button", { name: "Revenue" });
    await fireEvent.click(revHeaderBtn);
    await tick();
    expect(view.container.querySelectorAll("tbody tr")[0].textContent).toContain("Bob");

    await fireEvent.click(revHeaderBtn);
    await tick();
    expect(view.container.querySelectorAll("tbody tr")[0].textContent).toContain("Charlie");

    // Global search filters down to Charlie
    const searchInput = view.getByLabelText("Search rows") as HTMLInputElement;
    await fireEvent.input(searchInput, { target: { value: "Charlie" } });
    await tick();
    expect(view.getByText("1 total row(s)")).toBeInTheDocument();
    expect(view.getByText("Charlie")).toBeInTheDocument();
  });

  it("supports checkbox selection and inline cell edit commit", async () => {
    const onSelectionChange = vi.fn();
    const onCellEditCommit = vi.fn();

    const view = render(CoimDataGrid, {
      props: {
        rows: sampleRows.slice(0, 2),
        columns: sampleColumns as unknown as CoimDataGridColumn[],
        checkboxSelection: true,
        onSelectionChange,
        onCellEditCommit: onCellEditCommit as unknown as (event: {
          row: Record<string, unknown>;
          rowId: string;
          columnId: string;
          value: unknown;
          previousValue: unknown;
        }) => void,
      },
    });
    await tick();

    const rowCheckbox = view.getByLabelText("Select row 1");
    await fireEvent.click(rowCheckbox);
    await tick();
    expect(onSelectionChange).toHaveBeenCalledWith(["1"], [sampleRows[0]]);

    // Inline cell edit via double click -> Enter
    const aliceCell = view.getByText("Alice").closest("td")!;
    await fireEvent.dblClick(aliceCell);
    await tick();
    const editInput = view.getByLabelText("Edit Name") as HTMLInputElement;
    await fireEvent.input(editInput, { target: { value: "Alicia" } });
    await fireEvent.keyDown(editInput, { key: "Enter" });
    await tick();

    expect(onCellEditCommit).toHaveBeenCalledWith({
      row: sampleRows[0],
      rowId: "1",
      columnId: "name",
      value: "Alicia",
      previousValue: "Alice",
    });
  });

  it("generates CSV and Excel binary workbook exports", async () => {
    const csv = buildCsvContent(sampleRows.slice(0, 2), sampleColumns);
    expect(csv).toContain("Name,Department,Revenue");
    expect(csv).toContain("Alice,Engineering,3200");

    const buf = await exportDataGridToExcel(sampleRows.slice(0, 2), sampleColumns, {
      download: false,
      sheetName: "Sales",
    });
    const bytes = new Uint8Array(buf);
    // XLSX is a ZIP archive starting with 'PK' (0x50, 0x4B)
    expect(bytes[0]).toBe(0x50);
    expect(bytes[1]).toBe(0x4b);
  });

  it("supports column groups, summary row, boolean/date inline editing, and toolbar Escape/click-away close", async () => {
    interface RichRow extends Record<string, unknown> {
      id: string;
      account: string;
      active: boolean;
      renewal: string;
      arr: number;
    }

    const richRows: RichRow[] = [
      { id: "r1", account: "Northstar", active: true, renewal: "2026-12-01", arr: 12000 },
      { id: "r2", account: "Vesper", active: false, renewal: "2026-11-15", arr: 8000 },
    ];
    const onCellEditCommit = vi.fn();

    const richCols: CoimDataGridColumn<RichRow>[] = [
      { id: "account", field: "account", headerName: "Account", editable: true },
      { id: "active", field: "active", headerName: "Active", type: "boolean", editable: true },
      { id: "renewal", field: "renewal", headerName: "Renewal", type: "date", editable: true },
      { id: "arr", field: "arr", headerName: "ARR", type: "number", aggregationFn: "sum" },
    ];

    const view = render(CoimDataGrid, {
      props: {
        rows: richRows,
        columns: richCols as unknown as CoimDataGridColumn[],
        columnGroups: [
          { id: "grp-profile", headerName: "Customer Profile", children: ["account", "active"] },
          { id: "grp-billing", headerName: "Contract Metrics", children: ["renewal", "arr"] },
        ],
        showSummaryRow: true,
        onCellEditCommit: onCellEditCommit as never,
      },
    });
    await tick();

    // Column group headers + summary row aggregate rendered
    expect(view.getByText("Customer Profile")).toBeInTheDocument();
    expect(view.getByText("Contract Metrics")).toBeInTheDocument();
    expect(view.getByText("Sum: 20000")).toBeInTheDocument();

    // Boolean checkbox inline editor
    const activeCell = view.getByText("Yes").closest("td")!;
    await fireEvent.dblClick(activeCell);
    await tick();
    const boolCheckbox = view.getByLabelText("Edit Active") as HTMLInputElement;
    expect(boolCheckbox.type).toBe("checkbox");
    await fireEvent.click(boolCheckbox);
    await tick();
    expect(onCellEditCommit).toHaveBeenCalledWith(
      expect.objectContaining({ rowId: "r1", columnId: "active", value: false, previousValue: true }),
    );

    // Date inline editor
    const dateCell = view.getByText("2026-12-01").closest("td")!;
    await fireEvent.dblClick(dateCell);
    await tick();
    const dateInput = view.getByLabelText("Edit Renewal") as HTMLInputElement;
    expect(dateInput.type).toBe("date");
    await fireEvent.input(dateInput, { target: { value: "2027-01-15" } });
    await fireEvent.keyDown(dateInput, { key: "Enter" });
    await tick();
    expect(onCellEditCommit).toHaveBeenCalledWith(
      expect.objectContaining({
        rowId: "r1",
        columnId: "renewal",
        value: "2027-01-15",
        previousValue: "2026-12-01",
      }),
    );

    // Toolbar columns menu closes on Escape and outside pointerdown
    const columnsBtn = view.getByRole("button", { name: "Columns" });
    await fireEvent.click(columnsBtn);
    await tick();
    expect(columnsBtn.getAttribute("aria-expanded")).toBe("true");
    await fireEvent.keyDown(window, { key: "Escape" });
    await tick();
    expect(columnsBtn.getAttribute("aria-expanded")).toBe("false");

    await fireEvent.click(columnsBtn);
    await tick();
    expect(columnsBtn.getAttribute("aria-expanded")).toBe("true");
    await fireEvent.pointerDown(document.body);
    await tick();
    expect(columnsBtn.getAttribute("aria-expanded")).toBe("false");
  });

  it("supports row pinning, row reordering, cell selection, clipboard paste, lazy loading, and column virtualization", async () => {
    const onRowOrderChange = vi.fn();
    const onCellSelectionChange = vi.fn();
    const onClipboardPaste = vi.fn();
    const onLoadMore = vi.fn();

    const view = render(CoimDataGrid, {
      props: {
        rows: sampleRows,
        columns: sampleColumns as unknown as CoimDataGridColumn[],
        pinnedRows: { top: ["4"], bottom: ["2"] },
        rowReordering: true,
        cellSelection: true,
        enableClipboardPaste: true,
        hasMore: true,
        onRowOrderChange,
        onCellSelectionChange,
        onClipboardPaste: onClipboardPaste as never,
        onLoadMore,
      },
    });
    await tick();

    // Top pinned row 4 ("Diana") appears first, bottom pinned row 2 ("Bob") appears last
    const bodyRows = Array.from(view.container.querySelectorAll("tbody tr.coim-data-grid-row"));
    expect(bodyRows[0].getAttribute("data-pinned-row")).toBe("top");
    expect(bodyRows[0].textContent).toContain("Diana");
    expect(bodyRows[bodyRows.length - 1].getAttribute("data-pinned-row")).toBe("bottom");
    expect(bodyRows[bodyRows.length - 1].textContent).toContain("Bob");

    // Keyboard row reordering via Alt+ArrowDown on unpinned row 1
    const reorderBtn = view.getByRole("button", { name: "Reorder row 1" });
    await fireEvent.keyDown(reorderBtn, { key: "ArrowDown", altKey: true });
    await tick();
    expect(onRowOrderChange).toHaveBeenCalledWith(
      ["2", "1", "3", "4"],
      expect.any(Array),
    );

    // Cell selection (single + Shift range) and TSV clipboard paste
    const nameCell = view.getByText("Alice").closest("td")!;
    await fireEvent.click(nameCell);
    await tick();
    expect(nameCell.getAttribute("data-cell-selected")).toBe("true");
    expect(onCellSelectionChange).toHaveBeenCalled();

    const revCell = view.getByText("4900").closest("td")!;
    await fireEvent.click(revCell, { shiftKey: true });
    await tick();
    expect(onCellSelectionChange.mock.calls.at(-1)?.[0].length).toBeGreaterThan(1);

    await fireEvent.click(nameCell);
    const table = view.getByRole("grid");
    await fireEvent.paste(table, {
      clipboardData: {
        getData: () => "Alicia Prime\n",
      },
    });
    expect(onClipboardPaste).toHaveBeenCalledWith([
      expect.objectContaining({ rowId: "1", columnId: "name", value: "Alicia Prime" }),
    ]);

    // Lazy loading scroll trigger near bottom
    const scrollContainer = view.container.querySelector(".coim-data-grid-scroll") as HTMLDivElement;
    Object.defineProperty(scrollContainer, "scrollHeight", { value: 500, configurable: true });
    Object.defineProperty(scrollContainer, "clientHeight", { value: 450, configurable: true });
    Object.defineProperty(scrollContainer, "scrollTop", { value: 30, configurable: true });
    await fireEvent.scroll(scrollContainer);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
    view.unmount();

    // Wide column virtualization slices unpinned center columns cleanly
    const wideCols: CoimDataGridColumn<Record<string, unknown>>[] = Array.from(
      { length: 12 },
      (_, idx) => ({ id: `col${idx}`, field: `col${idx}`, headerName: `Col ${idx}`, width: 250 }),
    );
    const wideRow = Object.fromEntries(wideCols.map((c) => [c.id, `v-${c.id}`]));
    const wideView = render(CoimDataGrid, {
      props: {
        rows: [{ id: "w1", ...wideRow }],
        columns: wideCols,
        virtualizeColumns: true,
        columnOverscan: 1,
      },
    });
    await tick();
    const headerCount = wideView.container.querySelectorAll('thead th[role="columnheader"]').length;
    expect(headerCount).toBeLessThan(12);
  });

  it('supports editMode="row" full-row editing, commit without blur commit, cancel, and delete', async () => {
    const onRowEditCommit = vi.fn();
    const onRowEditCancel = vi.fn();
    const onRowDelete = vi.fn();
    const editableCols: CoimDataGridColumn<RowItem>[] = [
      { id: "name", field: "name", headerName: "Name", editable: true, width: 160 },
      {
        id: "department",
        field: "department",
        headerName: "Department",
        editable: true,
        options: ["Engineering", "Sales", "Design"],
        width: 140,
      },
      { id: "revenue", field: "revenue", headerName: "Revenue", type: "number", editable: true, align: "right", width: 120 },
    ];

    const view = render(CoimDataGrid, {
      props: {
        rows: sampleRows,
        columns: editableCols as unknown as CoimDataGridColumn[],
        editMode: "row",
        onRowEditCommit,
        onRowEditCancel,
        onRowDelete,
      },
    });
    await tick();

    await fireEvent.click(view.getByRole("button", { name: "Edit row 1" }));
    await tick();

    const nameInput = view.getByLabelText("Edit Name") as HTMLInputElement;
    const deptSelect = view.getByLabelText("Edit Department") as HTMLSelectElement;
    const revInput = view.getByLabelText("Edit Revenue") as HTMLInputElement;

    await fireEvent.input(nameInput, { target: { value: "Alice Prime" } });
    await fireEvent.blur(nameInput);
    await tick();
    expect(onRowEditCommit).not.toHaveBeenCalled();

    await fireEvent.change(deptSelect, { target: { value: "Sales" } });
    await fireEvent.input(revInput, { target: { value: "5100" } });
    await fireEvent.click(view.getByRole("button", { name: "Save row 1" }));
    await tick();

    expect(onRowEditCommit).toHaveBeenCalledTimes(1);
    expect(onRowEditCommit).toHaveBeenCalledWith({
      rowId: "1",
      row: expect.objectContaining({ name: "Alice Prime", department: "Sales", revenue: 5100 }),
      previousRow: expect.objectContaining({ name: "Alice", department: "Engineering", revenue: 3200 }),
      changedFields: expect.arrayContaining(["name", "department", "revenue"]),
    });

    await fireEvent.click(view.getByRole("button", { name: "Edit row 2" }));
    await tick();
    await fireEvent.click(view.getByRole("button", { name: "Cancel row 2" }));
    await tick();
    expect(onRowEditCancel).toHaveBeenCalledWith("2");

    await fireEvent.click(view.getByRole("button", { name: "Edit row 3" }));
    await tick();
    await fireEvent.keyDown(view.getByLabelText("Edit Name"), { key: "Escape" });
    await tick();
    expect(onRowEditCancel).toHaveBeenCalledWith("3");

    await fireEvent.click(view.getByRole("button", { name: "Delete row 4" }));
    expect(onRowDelete).toHaveBeenCalledWith(sampleRows[3], "4");
  });

  it("supports collapsible column groups with defaultCollapsed and groupHeaderHeight", async () => {
    const groups: CoimDataGridColumnGroup[] = [
      {
        id: "identity",
        headerName: "Identity",
        children: ["name", "department"],
        collapsible: true,
        collapsibleColumns: ["department"],
        defaultCollapsed: true,
      },
    ];

    const view = render(CoimDataGrid, {
      props: {
        rows: sampleRows,
        columns: sampleColumns as unknown as CoimDataGridColumn[],
        columnGroups: groups,
        groupHeaderHeight: 42,
      },
    });
    await tick();

    const groupRow = view.container.querySelector("tr.coim-data-grid-group-head") as HTMLTableRowElement;
    expect(groupRow).toBeTruthy();
    expect(groupRow.getAttribute("style")).toContain("height: 42px");

    const expandBtn = view.getByRole("button", { name: "Expand group Identity" });
    expect(expandBtn.getAttribute("aria-expanded")).toBe("false");
    expect(view.queryByRole("columnheader", { name: /Department/i })).toBeNull();
    expect(view.getByRole("columnheader", { name: /Name/i })).toBeInTheDocument();

    await fireEvent.click(expandBtn);
    await tick();

    const collapseBtn = view.getByRole("button", { name: "Collapse group Identity" });
    expect(collapseBtn.getAttribute("aria-expanded")).toBe("true");
    expect(view.getByRole("columnheader", { name: /Department/i })).toBeInTheDocument();

    await fireEvent.click(collapseBtn);
    await tick();
    expect(view.queryByRole("columnheader", { name: /Department/i })).toBeNull();
  });

  it("computes pivot tables and toggles toolbar Pivot mode cleanly", async () => {
    interface SalesRow extends Record<string, unknown> {
      id: string;
      department: string;
      region: string;
      revenue: number;
    }
    const pivotRows: SalesRow[] = [
      { id: "1", department: "Engineering", region: "North", revenue: 1200 },
      { id: "2", department: "Engineering", region: "South", revenue: 800 },
      { id: "3", department: "Sales", region: "North", revenue: 900 },
    ];
    const pivotCols: CoimDataGridColumn<SalesRow>[] = [
      { id: "department", field: "department", headerName: "Department", editable: true },
      { id: "region", field: "region", headerName: "Region", editable: true },
      { id: "revenue", field: "revenue", headerName: "Revenue", type: "number" },
    ];

    const built = buildPivotTable(pivotRows, pivotCols, {
      rowFields: ["department"],
      columnField: "region",
      valueField: "revenue",
      aggregationFn: "sum",
      showRowTotals: true,
    });
    expect(built.rows).toHaveLength(2);
    expect(built.rows[0]).toMatchObject({ department: "Engineering", __pivot_0: 1200, __pivot_1: 800, __pivot_total: 2000 });
    expect(built.columnGroups[0].id).toBe("pivot-columns-group");

    const onPivotModeChange = vi.fn();
    const view = render(CoimDataGrid, {
      props: {
        rows: pivotRows,
        columns: pivotCols as unknown as CoimDataGridColumn[],
        editMode: "row",
        pivotConfig: {
          rowFields: ["department"],
          columnField: "region",
          valueField: "revenue",
          aggregationFn: "sum",
        },
        onPivotModeChange,
      },
    });
    await tick();

    expect(view.getByRole("button", { name: "Edit row 1" })).toBeInTheDocument();
    const pivotBtn = view.getByRole("button", { name: /^Pivot$/i });
    expect(pivotBtn.getAttribute("aria-pressed")).toBe("false");

    await fireEvent.click(pivotBtn);
    await tick();

    expect(onPivotModeChange).toHaveBeenCalledWith(true);
    expect(pivotBtn.getAttribute("aria-pressed")).toBe("true");
    expect(view.getByText("Revenue (sum) by Region")).toBeInTheDocument();
    expect(view.getByRole("columnheader", { name: /Total/i })).toBeInTheDocument();
    expect(view.queryByRole("button", { name: "Edit row 1" })).toBeNull();

    await fireEvent.click(pivotBtn);
    await tick();

    expect(onPivotModeChange).toHaveBeenCalledWith(false);
    expect(pivotBtn.getAttribute("aria-pressed")).toBe("false");
    expect(view.getByRole("button", { name: "Edit row 1" })).toBeInTheDocument();
  });

  it("supports interactive Pivot Field Configurator field updates and reordering", async () => {
    interface SalesRow extends Record<string, unknown> {
      id: string;
      department: string;
      region: string;
      quarter: string;
      revenue: number;
    }
    const pivotRows: SalesRow[] = [
      { id: "1", department: "Engineering", region: "North", quarter: "Q1", revenue: 1000 },
      { id: "2", department: "Engineering", region: "South", quarter: "Q2", revenue: 2000 },
      { id: "3", department: "Sales", region: "North", quarter: "Q1", revenue: 500 },
    ];
    const pivotCols: CoimDataGridColumn<SalesRow>[] = [
      { id: "department", field: "department", headerName: "Department" },
      { id: "region", field: "region", headerName: "Region" },
      { id: "quarter", field: "quarter", headerName: "Quarter" },
      { id: "revenue", field: "revenue", headerName: "Revenue", type: "number" },
    ];
    const onPivotConfigChange = vi.fn();

    const view = render(CoimDataGrid, {
      props: {
        rows: pivotRows,
        columns: pivotCols as unknown as CoimDataGridColumn[],
        pivotMode: true,
        pivotConfig: {
          rowFields: ["department"],
          columnField: "region",
          valueField: "revenue",
          aggregationFn: "sum",
          showRowTotals: true,
        },
        onPivotConfigChange,
      },
    });
    await tick();

    await fireEvent.click(view.getByRole("button", { name: /^Pivot Fields$/i }));
    await tick();
    expect(view.getByRole("region", { name: "Pivot field configurator" })).toBeInTheDocument();

    // Add second row field ("quarter") and reorder it up
    const addSelect = view.getByLabelText("Add row field") as HTMLSelectElement;
    await fireEvent.change(addSelect, { target: { value: "quarter" } });
    await fireEvent.click(view.getByRole("button", { name: "Confirm add row field" }));
    await tick();

    expect(onPivotConfigChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ rowFields: ["department", "quarter"] }),
    );

    await fireEvent.click(view.getByRole("button", { name: "Move Quarter up" }));
    await tick();
    expect(onPivotConfigChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ rowFields: ["quarter", "department"] }),
    );

    // Change aggregation to mean
    await fireEvent.change(view.getByLabelText("Pivot aggregation"), {
      target: { value: "mean" },
    });
    await tick();
    expect(view.getByText("Revenue (mean) by Region")).toBeInTheDocument();
  });

  it("supports provider-agnostic AI Assistant in disabled and configured states", async () => {
    const unconfigured = render(CoimDataGrid, {
      props: {
        rows: sampleRows,
        columns: sampleColumns as unknown as CoimDataGridColumn[],
        enableAiAssistant: true,
      },
    });
    await tick();

    await fireEvent.click(unconfigured.getByRole("button", { name: /^AI Assistant$/i }));
    await tick();

    expect(unconfigured.getByText(/AI provider not configured/i)).toBeInTheDocument();
    expect(unconfigured.getByLabelText("AI query prompt")).toBeDisabled();
    expect(unconfigured.getByRole("button", { name: "Apply Prompt" })).toBeDisabled();
    unconfigured.unmount();

    const executeQuery = vi.fn().mockResolvedValueOnce({
      summary: "Filtered Engineering department sorted by revenue descending",
      columnFilters: [{ id: "department", value: "Engineering" }],
      sorting: [{ id: "revenue", desc: true }],
    });
    const onAiQueryApplied = vi.fn();

    const configured = render(CoimDataGrid, {
      props: {
        rows: sampleRows,
        columns: sampleColumns as unknown as CoimDataGridColumn[],
        aiProvider: { id: "custom-llm", label: "Custom Provider", executeQuery },
        onAiQueryApplied,
      },
    });
    await tick();

    await fireEvent.click(configured.getByRole("button", { name: /^AI Assistant$/i }));
    await tick();

    const input = configured.getByLabelText("AI query prompt") as HTMLInputElement;
    expect(input).not.toBeDisabled();
    await fireEvent.input(input, { target: { value: "Show Engineering top earners" } });
    await fireEvent.click(configured.getByRole("button", { name: "Apply Prompt" }));
    await tick();
    await tick();

    expect(executeQuery).toHaveBeenCalledTimes(1);
    expect(onAiQueryApplied).toHaveBeenCalled();
    expect(configured.getByText("Filtered Engineering department sorted by revenue descending")).toBeInTheDocument();
    expect(configured.getByText("Charlie")).toBeInTheDocument();
    expect(configured.queryByText("Bob")).toBeNull();
  });
});
