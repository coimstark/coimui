<script lang="ts">
  import { CoimCard, CoimCardContent, CoimCardHeader, CoimChip, CoimList, CoimListItem, CoimListItemText } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";

  const releases = [
    {
      version: "v1.1.1",
      date: "Nov 2026",
      notes: "Fixed CoimDataGridPivotPanel semantic list ARIA structure (WCAG 1.3.1), CoimVersionSelect default label resolution via COIMUI_VERSION, and Showcase API documentation defaults.",
    },
    {
      version: "v1.1.0",
      date: "Nov 2026",
      notes: "Added native translate i18n across CoimDataGrid, CoimDataGridToolbar, CoimDataGridPivotPanel, and CoimDataGridAiBar via DEFAULT_DATA_GRID_LABELS and resolveDataGridLabel(), plus CoimPivotTableOptions.",
    },
    {
      version: "v1.0.1",
      date: "Nov 2026",
      notes: "Added DataGrid full-row editing, collapsible column groups, interactive Pivot Field Configurator, provider-agnostic AI Assistant, dark-mode WCAG AA foreground tokens, and full Showcase application suites.",
    },
    {
      version: "v1.0.0",
      date: "Nov 2026",
      notes: "Initial stable release of @coimui/svelte with core components, 469 Ci icons, charts, pickers, layouts, and dual application templates.",
    },
  ];
</script>

<svelte:head><title>CoimUI Docs — Changelog</title></svelte:head>

<DocsSubNav section="Welcome" title="Release Changelog" subtitle="Package milestones and verified API additions.">
  <CoimCard>
    <CoimCardHeader title="Release History" />
    <CoimCardContent>
      <CoimList>
        {#each releases as rel (rel.version)}
          <CoimListItem>
            <CoimListItemText primary={`${rel.version} (${rel.date})`} secondary={rel.notes} />
            <CoimChip label="Verified" color="success" size="small" variant="pastel" />
          </CoimListItem>
        {/each}
      </CoimList>
    </CoimCardContent>
  </CoimCard>
</DocsSubNav>
