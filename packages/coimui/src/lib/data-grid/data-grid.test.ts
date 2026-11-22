import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/svelte";
import { tick } from "svelte";
import CoimDataGrid from "./CoimDataGrid.svelte";
import { buildCsvContent, exportDataGridToExcel } from "./export-utils.js";
import type { CoimDataGridColumn } from "./types.js";

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
});
