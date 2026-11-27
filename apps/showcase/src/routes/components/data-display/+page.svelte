<script lang="ts">
  import {
    COIMUI_VERSION,
    CoimAvatar,
    CoimAvatarGroup,
    CoimBadge,
    CoimBreadcrumbs,
    CoimChip,
    CoimFormControlLabel,
    CoimGrid,
    CoimList,
    CoimListItem,
    CoimListItemAvatar,
    CoimListItemButton,
    CoimListItemIcon,
    CoimListItemText,
    CoimListSubheader,
    CoimRichTreeView,
    CoimSelect,
    CoimSimpleTreeView,
    CoimStack,
    CoimSwitch,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableFooter,
    CoimTableHead,
    CoimTablePagination,
    CoimTableRow,
    CoimTableSortLabel,
    CoimTimeline,
    CoimTimelineConnector,
    CoimTimelineContent,
    CoimTimelineDot,
    CoimTimelineItem,
    CoimTimelineOppositeContent,
    CoimTimelineSeparator,
    CoimTooltip,
    CoimTooltipProvider,
    CoimTreeItem,
    CoimTypography,
    toast,
    type CoimAvatarItem,
    type CoimTreeItemData,
  } from "@coimui/svelte";
  import { CiBell, CiCheckSquare, CiFolder, CiUser } from "@coimui/svelte/icons";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import type { ComponentApiGroup } from "#lib/components/doc-types.ts";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  const END_SCRIPT = "</" + "script>";

  const avatars: CoimAvatarItem[] = [
    { id: "1", initials: "LE", alt: "Laura Ellis" },
    { id: "2", initials: "MK", alt: "Mateo Khan" },
    { id: "3", initials: "SR", alt: "Sora Park" },
    { id: "4", initials: "AL", alt: "Ari Lindqvist" },
    { id: "5", initials: "NR", alt: "Nadia Rahman" },
  ];

  const defaultTags = ["TypeScript 7", "Svelte 5", "Tailwind 4", "WCAG AA"];
  let tags = $state([...defaultTags]);

  // Interactive Badge & Chip controls
  let chipVariant = $state<"filled" | "outlined" | "pastel">("pastel");
  let chipColor = $state<"primary" | "secondary" | "success" | "warning" | "error" | "info">("primary");
  let chipDeletable = $state(true);

  const badgeChipCode = $derived(`<script lang="ts">
  import { CoimAvatarGroup, CoimBadge, CoimChip, CoimTooltip, CoimTooltipProvider } from "@coimui/svelte";
${END_SCRIPT}

<CoimTooltipProvider>
  <CoimAvatarGroup {avatars} max={3} />
  <CoimBadge badgeContent={14} max={9} color="${chipColor}">
    <CoimChip label="Inbox" variant="${chipVariant}" color="${chipColor}"${chipDeletable ? " deletable" : ""} />
  </CoimBadge>
  <CoimTooltip title="Active queue" placement="top"><span>Hover or Focus Me</span></CoimTooltip>
</CoimTooltipProvider>`);

  const badgeChipApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimAvatar & CoimAvatarGroup & CoimBadge",
      props: [
        { name: "CoimAvatar", type: "src?, alt?, initials?, size?, color?", description: "Circular profile avatar with fallback initials." },
        { name: "CoimAvatarGroup.max", type: "number", defaultValue: "5", description: "Caps rendered avatars and shows +N overflow pill." },
        { name: "CoimBadge.badgeContent / max", type: "string | number / number", defaultValue: "undefined / 99", description: "Anchored counter or status dot (dot?: boolean)." },
      ],
    },
    {
      title: "CoimChip & CoimTooltip",
      props: [
        { name: "CoimChip.variant / color", type: "\"filled\" | \"outlined\" | \"pastel\" / CoimColor", defaultValue: "\"filled\" / \"grey\"", description: "Visual tag style and semantic tone." },
        { name: "CoimChip.deletable / onDelete", type: "boolean / () => void", defaultValue: "false", kind: "event", description: "Displays accessible delete icon button." },
        { name: "CoimTooltip.title / placement", type: "string / \"top\" | \"bottom\" | \"left\" | \"right\"", description: "Keyboard & pointer tooltip rendered inside CoimTooltipProvider." },
      ],
    },
  ];

  interface MetricRow {
    id: string;
    module: string;
    bundleKb: number;
    tests: number;
  }

  const baseRows: MetricRow[] = [
    { id: "core", module: "@coimui/svelte (core)", bundleKb: 42, tests: 46 },
    { id: "grid", module: "@coimui/svelte/data-grid", bundleKb: 38, tests: 7 },
    { id: "charts", module: "@coimui/svelte/charts", bundleKb: 54, tests: 5 },
    { id: "dates", module: "@coimui/svelte/date-pickers", bundleKb: 31, tests: 5 },
    { id: "plugins", module: "@coimui/svelte/plugins", bundleKb: 29, tests: 3 },
  ];

  let sortDir = $state<"asc" | "desc">("asc");
  let page = $state(0);
  const rowsPerPage = 3;

  const sortedRows = $derived(
    [...baseRows].sort((a, b) =>
      sortDir === "asc" ? a.bundleKb - b.bundleKb : b.bundleKb - a.bundleKb,
    ),
  );
  const pagedRows = $derived(sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage));
  const totalTests = baseRows.reduce((acc, r) => acc + r.tests, 0);

  let simpleExpanded = $state(["src"]);
  let simpleSelected = $state(["tokens"]);

  let richItems = $state<CoimTreeItemData[]>([
    {
      id: "packages",
      label: "packages",
      editable: true,
      children: [
        { id: "svelte", label: "@coimui/svelte", editable: true },
        { id: "tokens-json", label: "design-tokens.css", editable: true },
      ],
    },
    {
      id: "apps",
      label: "apps",
      editable: true,
      children: [
        { id: "starter", label: "@coimui/starter", editable: true },
        { id: "showcase", label: "@coimui/showcase", editable: true },
      ],
    },
  ]);

  function renameTreeNode(nodes: CoimTreeItemData[], targetId: string, nextLabel: string): CoimTreeItemData[] {
    return nodes.map((n) => ({
      ...n,
      label: n.id === targetId ? nextLabel : n.label,
      children: n.children ? renameTreeNode(n.children, targetId, nextLabel) : undefined,
    }));
  }

  const tableTreeApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimTable & CoimTableFooter & CoimTablePagination",
      props: [
        { name: "CoimTable.size", type: "\"small\" | \"medium\"", defaultValue: "\"medium\"", description: "Controls cell padding density." },
        { name: "CoimTableFooter", type: "HTMLTableSectionElement attrs", description: "Semantic <tfoot> summary row section." },
        { name: "CoimTablePagination", type: "count, page (bindable), rowsPerPage, rowsPerPageOptions", kind: "bindable", description: "Accessible table pagination footer bar." },
      ],
    },
    {
      title: "CoimList, CoimListItemAvatar, TreeViews & Timeline",
      props: [
        { name: "CoimListItemAvatar", type: "children: Snippet", kind: "snippet", description: "Aligns CoimAvatar cleanly inside CoimListItem / CoimListItemButton." },
        { name: "CoimSimpleTreeView", type: "expandedItems?, selectedItems?, multiSelect?, bordered?", kind: "bindable", description: "Declarative tree composed with CoimTreeItem children." },
        { name: "CoimRichTreeView", type: "items (bindable), reorderable?, onItemLabelChange?, onItemOrderChange?", kind: "event", description: "Data-driven tree supporting inline rename & drag/drop reordering." },
        { name: "CoimTimeline.position", type: "\"left\" | \"right\" | \"alternate\"", defaultValue: "\"right\"", description: "Controls timeline content & opposite-content side alignment." },
      ],
    },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Data Display</title>
</svelte:head>

<CoimTooltipProvider>
  <CoimStack spacing={6}>
    <div>
      <CoimBreadcrumbs items={[{ label: "Components", href: "/components" }, { label: "Data Display" }]} />
      <CoimTypography variant="h1" class="mt-2">Data Display</CoimTypography>
      <p class="text-text-secondary mt-1">
        Avatars, overflow badges, deletable chips, tooltips, semantic lists with avatars, sortable tables with footers, timelines, and tree views.
      </p>
    </div>

    <CoimTypography variant="h2">Identity, Structured Tables &amp; Hierarchy</CoimTypography>

    <ComponentDocCard
      id="coim-badge-chip"
      title="Avatars, Badges, Chips &amp; Tooltips"
      description="Compact identity clusters, bounded notification counters, filter chips, and hover/focus tooltips."
      code={badgeChipCode}
      apiGroups={badgeChipApiGroups}
    >
      <CoimStack spacing={4}>
        <div class="flex flex-wrap items-center gap-6">
          <CoimAvatarGroup {avatars} max={3} />
          <CoimAvatar initials="CU" alt="CoimUI Maintainer" color="primary" />
          <CoimBadge badgeContent={14} max={9} color={chipColor}>
            <span class="border-grey-200 inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm">
              <CiBell size={16} /> Notifications
            </span>
          </CoimBadge>
          <CoimTooltip title="Keyboard-accessible tooltip helper" placement="top">
            <span class="border-grey-200 rounded-lg border px-3 py-1.5 text-sm">Hover or Focus Me</span>
          </CoimTooltip>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          {#each tags as tag (tag)}
            <CoimChip
              label={tag}
              color={chipColor}
              variant={chipVariant}
              deletable={chipDeletable}
              onDelete={() => {
                tags = tags.filter((t) => t !== tag);
                toast.info(`Removed chip: ${tag}`);
              }}
            />
          {/each}
          {#if tags.length < defaultTags.length}
            <button
              type="button"
              onclick={() => (tags = [...defaultTags])}
              class="text-primary hover:bg-primary/10 cursor-pointer rounded-md border-0 bg-transparent px-2.5 py-1 text-xs font-semibold transition-colors"
            >
              Restore chips
            </button>
          {/if}
        </div>
      </CoimStack>

      {#snippet controls()}
        <div class="grid gap-3 sm:grid-cols-3 sm:items-center">
          <CoimSelect
            label="Chip Variant"
            size="small"
            value={chipVariant}
            onValueChange={(v) => {
              if (v === "filled" || v === "outlined" || v === "pastel") chipVariant = v;
            }}
            options={[
              { value: "pastel", label: "pastel" },
              { value: "filled", label: "filled" },
              { value: "outlined", label: "outlined" },
            ]}
            fullWidth
          />
          <CoimSelect
            label="Badge / Chip Color"
            size="small"
            value={chipColor}
            onValueChange={(v) => {
              if (typeof v === "string") chipColor = v as typeof chipColor;
            }}
            options={[
              { value: "primary", label: "primary" },
              { value: "secondary", label: "secondary" },
              { value: "success", label: "success" },
              { value: "info", label: "info" },
              { value: "warning", label: "warning" },
              { value: "error", label: "error" },
            ]}
            fullWidth
          />
          <CoimFormControlLabel label="Deletable Chips">
            <CoimSwitch bind:checked={chipDeletable} />
          </CoimFormControlLabel>
        </div>
      {/snippet}
    </ComponentDocCard>

    <ComponentDocCard
      id="coim-table-tree"
      title="Lists, Tables, Timelines &amp; Tree Views"
      description="Sortable semantic tables with CoimTableFooter & pagination, CoimListItemAvatar rows, activity timelines, and interactive tree explorers."
      code={COMPONENT_CODE_EXAMPLES.tablesListsTrees}
      apiGroups={tableTreeApiGroups}
    >
      <CoimGrid container spacing={4}>
        <CoimGrid size={{ xs: 12, lg: 7 }}>
          <CoimTableContainer>
            <CoimTable aria-label="Module bundle metrics">
              <CoimTableHead>
                <CoimTableRow>
                  <CoimTableCell>Package Subpath</CoimTableCell>
                  <CoimTableCell align="right">
                    <CoimTableSortLabel
                      active
                      direction={sortDir}
                      onclick={() => {
                        sortDir = sortDir === "asc" ? "desc" : "asc";
                      }}
                    >
                      Size (KB)
                    </CoimTableSortLabel>
                  </CoimTableCell>
                  <CoimTableCell align="right">Test Cases</CoimTableCell>
                </CoimTableRow>
              </CoimTableHead>
              <CoimTableBody>
                {#each pagedRows as row (row.id)}
                  <CoimTableRow hover>
                    <CoimTableCell class="font-mono text-xs">{row.module}</CoimTableCell>
                    <CoimTableCell align="right">{row.bundleKb} KB</CoimTableCell>
                    <CoimTableCell align="right">{row.tests}</CoimTableCell>
                  </CoimTableRow>
                {/each}
              </CoimTableBody>
              <CoimTableFooter>
                <CoimTableRow>
                  <CoimTableCell class="font-semibold">Total Across 5 Entrypoints</CoimTableCell>
                  <CoimTableCell align="right" class="font-semibold">194 KB</CoimTableCell>
                  <CoimTableCell align="right" class="font-semibold">{totalTests}</CoimTableCell>
                </CoimTableRow>
              </CoimTableFooter>
            </CoimTable>
            <CoimTablePagination
              count={baseRows.length}
              bind:page
              {rowsPerPage}
              rowsPerPageOptions={[3, 5]}
            />
          </CoimTableContainer>
        </CoimGrid>

        <CoimGrid size={{ xs: 12, lg: 5 }}>
          <CoimList class="border-grey-100 rounded-xl border">
            <CoimListSubheader>Quick Audit</CoimListSubheader>
            <CoimListItem>
              <CoimListItemAvatar>
                <CoimAvatar initials="LE" alt="Laura Ellis" color="primary" size="small" />
              </CoimListItemAvatar>
              <CoimListItemText primary="Laura Ellis" secondary="Release Lead (CoimListItemAvatar)" />
            </CoimListItem>
            <CoimListItemButton onclick={() => toast.info("Opened team directory")}>
              <CoimListItemIcon><CiUser /></CoimListItemIcon>
              <CoimListItemText primary="Maintainers Directory" secondary="12 active reviewers" />
            </CoimListItemButton>
            <CoimListItem>
              <CoimListItemIcon><CiCheckSquare /></CoimListItemIcon>
              <CoimListItemText primary="Schema Frozen" secondary={`Release v${COIMUI_VERSION} verified`} />
            </CoimListItem>
          </CoimList>
        </CoimGrid>

        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimTimeline position="right">
            <CoimTimelineItem>
              <CoimTimelineOppositeContent>09:15</CoimTimelineOppositeContent>
              <CoimTimelineSeparator>
                <CoimTimelineDot color="primary" />
                <CoimTimelineConnector />
              </CoimTimelineSeparator>
              <CoimTimelineContent>TypeScript 7 checks green</CoimTimelineContent>
            </CoimTimelineItem>
            <CoimTimelineItem>
              <CoimTimelineOppositeContent>09:42</CoimTimelineOppositeContent>
              <CoimTimelineSeparator>
                <CoimTimelineDot color="success" />
                <CoimTimelineConnector />
              </CoimTimelineSeparator>
              <CoimTimelineContent>Browser &amp; SSR suites passed</CoimTimelineContent>
            </CoimTimelineItem>
            <CoimTimelineItem>
              <CoimTimelineOppositeContent>10:05</CoimTimelineOppositeContent>
              <CoimTimelineSeparator>
                <CoimTimelineDot variant="outlined" color="info" />
              </CoimTimelineSeparator>
              <CoimTimelineContent>{`v${COIMUI_VERSION} artifact verified`}</CoimTimelineContent>
            </CoimTimelineItem>
          </CoimTimeline>
        </CoimGrid>

        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimStack spacing={3}>
            <CoimSimpleTreeView
              bind:expandedItems={simpleExpanded}
              bind:selectedItems={simpleSelected}
              bordered
            >
              <CoimTreeItem itemId="src" label="src">
                {#snippet icon()}<CiFolder size={16} />{/snippet}
                <CoimTreeItem itemId="tokens" label="theme-tokens.css" />
                <CoimTreeItem itemId="components" label="components/" />
              </CoimTreeItem>
            </CoimSimpleTreeView>
            <CoimRichTreeView
              bind:items={richItems}
              defaultExpandedItems={["packages"]}
              reorderable
              onItemLabelChange={(id, nextLabel) => {
                richItems = renameTreeNode(richItems, id, nextLabel);
                toast.success(`Renamed node "${nextLabel}"`);
              }}
              onItemOrderChange={() => toast.info("Updated tree hierarchy")}
            />
          </CoimStack>
        </CoimGrid>
      </CoimGrid>
    </ComponentDocCard>
  </CoimStack>
</CoimTooltipProvider>
