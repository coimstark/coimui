<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimChip,
    CoimPaper,
    CoimStack,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import {
    CoimDataGrid,
    CoimDataGridAiBar,
    CoimDataGridPivotPanel,
    CoimDataGridToolbar,
    DEFAULT_DATA_GRID_LABELS,
    buildPivotTable,
    resolveDataGridLabel,
    type CoimDataGridCellCoord,
    type CoimDataGridCellEditEvent,
    type CoimDataGridColumn,
    type CoimDataGridColumnGroup,
    type CoimDataGridDensity,
    type CoimDataGridPivotConfig,
    type CoimDataGridRowEditEvent,
  } from "@coimui/svelte/data-grid";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import type { ComponentApiGroup } from "#lib/components/doc-types.ts";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";
  import { showcaseI18n } from "#lib/i18n.svelte.ts";

  const END_SCRIPT = "</" + "script>";

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

  interface OpsLedgerRow extends Record<string, unknown> {
    id: string;
    service: string;
    owner: string;
    renewal: string;
    slaVerified: boolean;
    budget: number;
  }

  let opsRows = $state<OpsLedgerRow[]>([
    { id: "OPS-1", service: "API Gateway", owner: "Elena", renewal: "2026-12-01", slaVerified: true, budget: 18500 },
    { id: "OPS-2", service: "Search Index", owner: "Mateo", renewal: "2026-12-15", slaVerified: true, budget: 12400 },
    { id: "OPS-3", service: "Billing Sync", owner: "Sora", renewal: "2027-01-10", slaVerified: false, budget: 9600 },
    { id: "OPS-4", service: "Audit Archive", owner: "Liam", renewal: "2027-02-01", slaVerified: true, budget: 6400 },
  ]);
  let selectedOpsCells = $state<CoimDataGridCellCoord[]>([]);

  const opsColumnGroups: CoimDataGridColumnGroup[] = [
    {
      id: "grp-identity",
      headerName: "Service Identity",
      children: ["service", "owner"],
      collapsible: true,
      collapsibleColumns: ["owner"],
    },
    { id: "grp-governance", headerName: "Governance & Spend", children: ["renewal", "slaVerified", "budget"] },
  ];

  function handleOpsRowEditCommit(ev: CoimDataGridRowEditEvent<OpsLedgerRow>) {
    opsRows = opsRows.map((row) => (row.id === ev.rowId ? ev.row : row));
    toast.success(`Saved changes to ${ev.row.service}`);
  }

  function handleOpsRowDelete(row: OpsLedgerRow) {
    opsRows = opsRows.filter((item) => item.id !== row.id);
    toast.info(`Removed ${row.service}`);
  }

  const opsColumns: CoimDataGridColumn<OpsLedgerRow>[] = [
    { id: "service", field: "service", headerName: "Service", width: 170, editable: true },
    { id: "owner", field: "owner", headerName: "Owner", width: 130, editable: true },
    { id: "renewal", field: "renewal", headerName: "Renewal Date", type: "date", width: 150, editable: true },
    { id: "slaVerified", field: "slaVerified", headerName: "SLA Verified", type: "boolean", width: 130, editable: true },
    {
      id: "budget",
      field: "budget",
      headerName: "Annual Budget",
      type: "number",
      align: "right",
      width: 150,
      editable: true,
      aggregationFn: "sum",
      valueFormatter: (v) => `$${Number(v ?? 0).toLocaleString()}`,
    },
  ];

  // Modular sub-component states (below fold)
  let toolbarSearch = $state("");
  let toolbarDensity = $state<CoimDataGridDensity>("standard");
  let toolbarPivotOpen = $state(true);
  let toolbarAiOpen = $state(false);
  let pivotConfig = $state<CoimDataGridPivotConfig>({
    rowFields: ["region"],
    columnField: "tier",
    valueField: "mrr",
    aggregationFn: "sum",
    showRowTotals: true,
  });

  const pivotResult = $derived(
    buildPivotTable(rows, columns, pivotConfig, { translate: showcaseI18n.t }),
  );

  const modularCode = `<script lang="ts">
  import {
    CoimDataGridToolbar,
    CoimDataGridPivotPanel,
    CoimDataGridAiBar,
    DEFAULT_DATA_GRID_LABELS,
    resolveDataGridLabel,
    buildPivotTable,
  } from "@coimui/svelte/data-grid";
${END_SCRIPT}

<CoimDataGridToolbar
  bind:globalFilter={search}
  bind:density={density}
  {columns}
  pivotable
  aiAssistantEnabled
  translate={t}
/>
<CoimDataGridPivotPanel
  {columns}
  config={pivotConfig}
  translate={t}
  onChange={(next) => (pivotConfig = next)}
/>
<CoimDataGridAiBar {columns} {aiProvider} translate={t} onApplyResult={(res) => applyAi(res)} />`;

  const modularApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimDataGridToolbar & CoimDataGridPivotPanel & CoimDataGridAiBar",
      props: [
        { name: "CoimDataGridToolbar", type: "globalFilter?, density?, columns?, pivotable?, aiAssistantEnabled?, translate?", kind: "bindable", description: "Composable grid toolbar exposing search, grouping, columns, density & exports." },
        { name: "CoimDataGridPivotPanel", type: "columns, config, translate?, onChange, onClose?", kind: "event", description: "Drag/drop and accessible controls to configure pivot row/column/value fields." },
        { name: "CoimDataGridAiBar", type: "columns, aiProvider?, translate?, onApplyResult?, onReset?, onClose?", kind: "event", description: "Natural-language query bar delegated to user-supplied CoimDataGridAiProvider." },
      ],
    },
    {
      title: "i18n & Pivot Utilities (v1.1.0)",
      props: [
        { name: "DEFAULT_DATA_GRID_LABELS", type: "Record<string, string>", description: `English fallbacks covering ${Object.keys(DEFAULT_DATA_GRID_LABELS).length} grid chrome & ARIA keys.` },
        { name: "resolveDataGridLabel(translate, key, vars?)", type: "string", description: "Interpolates {var} tokens after resolving translated or default label." },
        { name: "buildPivotTable(rows, cols, config, options?)", type: "CoimPivotResult", description: "Generates pivoted column/row definitions with translated total headers." },
      ],
    },
  ];

  void resolveDataGridLabel;
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
    id="coim-data-grid"
    title="CoimDataGrid"
    description="Supports column pinning, sorting, column filters, grouping, density switching, inline editing, row selection, CSV &amp; XLSX exports."
    packageEntry="@coimui/svelte/data-grid"
    code={COMPONENT_CODE_EXAMPLES.dataGrid}
    propsDocs={[
      { name: "rows / columns", type: "TData[] / CoimDataGridColumn[]", description: "Typed row data and declarative column specs with snippets and aggregators." },
      { name: "checkboxSelection", type: "boolean", defaultValue: "false", description: "Prepends accessible multi/single row selection checkboxes." },
      { name: "virtualize", type: "boolean", defaultValue: "false", description: "Enables TanStack Virtual windowing for large datasets." },
      { name: "enableExport", type: "boolean", defaultValue: "true", description: "Exposes CSV, Excel (lazy ExcelJS), and print toolbar exports." },
      { name: "translate", type: "(key: string) => string", description: "Optional v1.1.0 i18n translator function overriding built-in DEFAULT_DATA_GRID_LABELS." },
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
        translate={showcaseI18n.t}
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

  <ComponentDocCard
    title="Collapsible Column Groups, Full-Row Editing, Pivoting &amp; Summary Footer"
    description="Supports collapsible column group headers, full-row Edit/Save/Cancel/Delete actions, toolbar Pivot mode, summary aggregates, top/bottom pinned rows, drag or Alt+Arrow row reordering, cell range selection, and TSV clipboard paste."
    packageEntry="@coimui/svelte/data-grid"
    code={COMPONENT_CODE_EXAMPLES.dataGrid}
  >
    <CoimStack spacing={3}>
      {#if selectedOpsCells.length > 0}
        <p class="text-primary text-sm font-medium">
          Selected cell(s): {selectedOpsCells.map((c) => `${c.rowId}:${c.columnId}`).join(", ")}
        </p>
      {/if}

      <CoimDataGrid
        rows={opsRows}
        columns={opsColumns}
        translate={showcaseI18n.t}
        columnGroups={opsColumnGroups}
        groupHeaderHeight={40}
        editMode="row"
        enableAiAssistant
        pivotConfig={{
          rowFields: ["owner"],
          columnField: "slaVerified",
          valueField: "budget",
          aggregationFn: "sum",
          showRowTotals: true,
        }}
        pinnedRows={{ top: ["OPS-1"] }}
        rowReordering
        showSummaryRow
        cellSelection
        enableClipboardPaste
        bind:selectedCells={selectedOpsCells}
        onRowEditCommit={handleOpsRowEditCommit}
        onRowDelete={handleOpsRowDelete}
        onRowOrderChange={(_ids, reordered) => {
          opsRows = reordered;
          toast.info("Updated service priority order");
        }}
      />
    </CoimStack>
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-datagrid-modular"
    title="Modular Sub-Components: Toolbar, PivotPanel, AiBar &amp; i18n"
    description="Compose CoimDataGridToolbar, CoimDataGridPivotPanel, and CoimDataGridAiBar independently or translate all grid strings via DEFAULT_DATA_GRID_LABELS."
    packageEntry="@coimui/svelte/data-grid"
    code={modularCode}
    apiGroups={modularApiGroups}
  >
    <CoimStack spacing={3}>
      <CoimDataGridToolbar
        bind:globalFilter={toolbarSearch}
        bind:density={toolbarDensity}
        columns={columns as unknown as CoimDataGridColumn<Record<string, unknown>>[]}
        pivotable
        pivotMode={false}
        pivotPanelOpen={toolbarPivotOpen}
        aiAssistantEnabled
        aiAssistantOpen={toolbarAiOpen}
        translate={showcaseI18n.t}
        onPivotPanelToggle={() => (toolbarPivotOpen = !toolbarPivotOpen)}
        onAiAssistantToggle={() => (toolbarAiOpen = !toolbarAiOpen)}
        onExportCsv={() => toast.info("Triggered CSV export callback")}
      />

      {#if toolbarAiOpen}
        <CoimDataGridAiBar
          {columns}
          translate={showcaseI18n.t}
          onApplyResult={() => toast.info("Applied AI assistant query result")}
          onClose={() => (toolbarAiOpen = false)}
        />
      {/if}

      {#if toolbarPivotOpen}
        <CoimDataGridPivotPanel
          {columns}
          config={pivotConfig}
          translate={showcaseI18n.t}
          onChange={(next) => (pivotConfig = next)}
          onClose={() => (toolbarPivotOpen = false)}
        />
      {/if}

      <CoimPaper variant="outlined" class="flex flex-wrap items-center gap-2 p-3 text-xs">
        <CoimChip label={`Density: ${toolbarDensity}`} size="small" color="primary" variant="pastel" />
        <CoimChip label={`Pivot Rows Computed: ${pivotResult.rows.length}`} size="small" color="secondary" variant="pastel" />
        <CoimChip label={`i18n Keys Built-in: ${Object.keys(DEFAULT_DATA_GRID_LABELS).length}`} size="small" variant="outlined" />
      </CoimPaper>
    </CoimStack>
  </ComponentDocCard>
</CoimStack>
