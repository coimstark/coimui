import { describe, expect, it } from "vitest";
import { render } from "svelte/server";
import CoimDataGrid from "./CoimDataGrid.svelte";
import type { CoimDataGridColumn } from "./types.js";

interface SampleRow extends Record<string, unknown> {
  id: string;
  name: string;
  amount: number;
}

const cols: CoimDataGridColumn<SampleRow>[] = [
  { id: "name", field: "name", headerName: "Name" },
  { id: "amount", field: "amount", headerName: "Amount", type: "number" },
];

describe("DataGrid SSR Safety", () => {
  it("renders CoimDataGrid cleanly on server without window errors", () => {
    const { body } = render(CoimDataGrid, {
      props: {
        rows: [
          { id: "r1", name: "Invoice #101", amount: 540 },
          { id: "r2", name: "Invoice #102", amount: 890 },
        ],
        columns: [
          { id: "name", field: "name", headerName: "Name" },
          { id: "amount", field: "amount", headerName: "Amount", type: "number", aggregationFn: "sum" },
        ] as unknown as CoimDataGridColumn[],
        columnGroups: [{ id: "grp-1", headerName: "Ledger Info", children: ["name", "amount"] }],
        showSummaryRow: true,
        pinnedRows: { top: ["r1"] },
        rowReordering: true,
        cellSelection: true,
        virtualizeColumns: false,
      },
    });
    expect(body).toContain("coim-data-grid");
    expect(body).toContain("Invoice #101");
    expect(body).toContain("2 total row(s)");
    expect(body).toContain("Ledger Info");
    expect(body).toContain("Sum: 1430");
  });

  it("renders collapsible columnGroups, editMode='row', and pivotMode cleanly on server", () => {
    const editableCols: CoimDataGridColumn<SampleRow & { region: string }>[] = [
      { id: "name", field: "name", headerName: "Name", editable: true },
      { id: "region", field: "region", headerName: "Region", editable: true },
      { id: "amount", field: "amount", headerName: "Amount", type: "number", editable: true },
    ];
    const ssrRows = [
      { id: "p1", name: "Alpha", region: "North", amount: 250 },
      { id: "p2", name: "Beta", region: "South", amount: 750 },
    ];

    const { body: rowEditBody } = render(CoimDataGrid, {
      props: {
        rows: ssrRows,
        columns: editableCols as unknown as CoimDataGridColumn[],
        editMode: "row",
        groupHeaderHeight: 44,
        columnGroups: [
          {
            id: "identity",
            headerName: "Identity",
            children: ["name", "region"],
            collapsible: true,
            collapsibleColumns: ["region"],
            defaultCollapsed: true,
          },
        ],
      },
    });
    expect(rowEditBody).toContain("Actions");
    expect(rowEditBody).toContain("Identity");
    expect(rowEditBody).toContain("height: 44px");
    expect(rowEditBody).not.toContain('data-col-id="region"');

    const { body: pivotBody } = render(CoimDataGrid, {
      props: {
        rows: ssrRows,
        columns: editableCols as unknown as CoimDataGridColumn[],
        pivotMode: true,
        enableAiAssistant: true,
        pivotConfig: {
          rowFields: ["name"],
          columnField: "region",
          valueField: "amount",
          aggregationFn: "sum",
        },
      },
    });
    expect(pivotBody).toContain("Total");
    expect(pivotBody).toContain("Amount (sum) by Region");
    expect(pivotBody).toContain("Pivot Fields");
    expect(pivotBody).toContain("AI Assistant");
  });

  it("renders translated DataGrid labels cleanly during SSR", () => {
    const translate = (key: string) =>
      (
        ({
          "data-grid-aria-label": "Tabel kontak",
          "data-grid-search-placeholder": "Cari...",
          "data-grid-columns": "Kolom",
          "data-grid-actions-header": "Aksi",
          "data-grid-total-rows": "{count} total baris",
          "data-grid-page-of": "Halaman {page} dari {totalPages}",
          "data-grid-empty": "Belum ada data.",
        }) as Record<string, string>
      )[key] ?? key;

    const { body } = render(CoimDataGrid, {
      props: {
        rows: [],
        columns: cols as unknown as CoimDataGridColumn[],
        editMode: "row",
        translate,
      },
    });

    expect(body).toContain('aria-label="Tabel kontak"');
    expect(body).toContain('placeholder="Cari..."');
    expect(body).toContain("Kolom");
    expect(body).toContain("Aksi");
    expect(body).toContain("0 total baris");
    expect(body).toContain("Halaman 1 dari 1");
    expect(body).toContain("Belum ada data.");
  });
});
