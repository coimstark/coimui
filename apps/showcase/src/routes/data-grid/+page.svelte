<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimChip,
    CoimStack,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import {
    CoimDataGrid,
    type CoimDataGridCellEditEvent,
    type CoimDataGridColumn,
  } from "@coimui/svelte/data-grid";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  interface AccountRow extends Record<string, unknown> {
    id: string;
    account: string;
    region: string;
    tier: "Enterprise" | "Growth" | "Starter";
    seats: number;
    mrr: number;
    status: "Active" | "Trial" | "Paused";
  }

  let rows = $state<AccountRow[]>([
    { id: "ACC-101", account: "Northstar Labs", region: "APAC", tier: "Enterprise", seats: 140, mrr: 14800, status: "Active" },
    { id: "ACC-102", account: "Vesper Robotics", region: "EU", tier: "Growth", seats: 48, mrr: 4200, status: "Active" },
    { id: "ACC-103", account: "Kestrel Bio", region: "NA", tier: "Enterprise", seats: 210, mrr: 21900, status: "Trial" },
    { id: "ACC-104", account: "Aurelia Retail", region: "APAC", tier: "Growth", seats: 62, mrr: 5400, status: "Active" },
    { id: "ACC-105", account: "Helios Freight", region: "EU", tier: "Starter", seats: 14, mrr: 980, status: "Paused" },
    { id: "ACC-106", account: "Sable Analytics", region: "NA", tier: "Enterprise", seats: 185, mrr: 18500, status: "Active" },
    { id: "ACC-107", account: "Lumen Works", region: "APAC", tier: "Growth", seats: 54, mrr: 4750, status: "Trial" },
    { id: "ACC-108", account: "Cinder Studios", region: "EU", tier: "Starter", seats: 19, mrr: 1290, status: "Active" },
  ]);

  let selectedIds = $state<string[]>([]);

  function statusColor(status: AccountRow["status"]) {
    if (status === "Active") return "success";
    if (status === "Trial") return "info";
    return "warning";
  }

  function handleCellEdit(ev: CoimDataGridCellEditEvent<AccountRow>) {
    rows = rows.map((row) =>
      row.id === ev.rowId ? { ...row, [ev.columnId]: ev.value } : row,
    );
    toast.success(`Updated ${ev.rowId} (${ev.columnId})`);
  }

  const columns: CoimDataGridColumn<AccountRow>[] = [
    { id: "id", field: "id", headerName: "Account ID", width: 120, pinned: "left" },
    { id: "account", field: "account", headerName: "Organization", width: 200, editable: true, filterable: true },
    { id: "region", field: "region", headerName: "Region", width: 100, groupable: true, filterable: true },
    {
      id: "tier",
      field: "tier",
      headerName: "Plan Tier",
      width: 130,
      editable: true,
      options: ["Enterprise", "Growth", "Starter"],
      groupable: true,
    },
    { id: "seats", field: "seats", headerName: "Seats", type: "number", width: 100, align: "right", editable: true, aggregationFn: "sum" },
    {
      id: "mrr",
      field: "mrr",
      headerName: "MRR (USD)",
      type: "number",
      width: 140,
      align: "right",
      aggregationFn: "sum",
      valueFormatter: (val) => `$${Number(val ?? 0).toLocaleString()}`,
    },
    {
      id: "status",
      field: "status",
      headerName: "Status",
      width: 130,
      pinned: "right",
      renderCell: statusBadge,
    },
  ];
</script>

{#snippet statusBadge({ row }: { value: unknown; row: AccountRow; rowId: string; column: CoimDataGridColumn<AccountRow> })}
  <CoimChip label={row.status} size="small" variant="pastel" color={statusColor(row.status)} />
{/snippet}

<svelte:head>
  <title>CoimUI Showcase — Data Grid</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Data Grid" }]} />
    <CoimTypography variant="h1" class="mt-2">Data Grid Engine</CoimTypography>
    <p class="text-text-secondary mt-1">
      Powered by TanStack Table v9, Virtualizer, Pragmatic Drag &amp; Drop, PapaParse CSV, and on-demand ExcelJS XLSX exports.
    </p>
  </div>

  <CoimTypography variant="h2">Interactive Enterprise Grid</CoimTypography>

  <ComponentDocCard
    title="CoimDataGrid"
    description="Supports column pinning, sorting, column filters, grouping, density switching, inline editing, row selection, CSV & XLSX exports."
    packageEntry="@coimui/svelte/data-grid"
    code={COMPONENT_CODE_EXAMPLES.dataGrid}
    propsDocs={[
      { name: "rows / columns", type: "TData[] / CoimDataGridColumn[]", description: "Typed row data and declarative column specs with snippets and aggregators." },
      { name: "checkboxSelection", type: "boolean", defaultValue: "false", description: "Prepends accessible multi/single row selection checkboxes." },
      { name: "virtualize", type: "boolean", defaultValue: "false", description: "Enables TanStack Virtual windowing for large datasets." },
      { name: "enableExport", type: "boolean", defaultValue: "true", description: "Exposes CSV, Excel (lazy ExcelJS), and print toolbar exports." },
    ]}
  >
    <CoimStack spacing={3}>
      {#if selectedIds.length > 0}
        <p class="text-primary text-sm font-medium">
          Selected accounts ({selectedIds.length}): {selectedIds.join(", ")}
        </p>
      {/if}

      <CoimDataGrid
        {rows}
        {columns}
        bind:selectedRowIds={selectedIds}
        checkboxSelection
        showColumnFilters
        groupable
        pageSize={5}
        exportFilename="coimui-accounts"
        onCellEditCommit={handleCellEdit}
      />
    </CoimStack>
  </ComponentDocCard>
</CoimStack>
