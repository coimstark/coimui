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
        columns: cols as unknown as CoimDataGridColumn[],
      },
    });
    expect(body).toContain("coim-data-grid");
    expect(body).toContain("Invoice #101");
    expect(body).toContain("2 total row(s)");
  });
});
