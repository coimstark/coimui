<script lang="ts">
  import {
    CoimAvatar,
    CoimAvatarGroup,
    CoimBadge,
    CoimBreadcrumbs,
    CoimChip,
    CoimGrid,
    CoimList,
    CoimListItem,
    CoimListItemButton,
    CoimListItemIcon,
    CoimListItemText,
    CoimListSubheader,
    CoimRichTreeView,
    CoimSimpleTreeView,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
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
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  const avatars: CoimAvatarItem[] = [
    { id: "1", initials: "LE", alt: "Laura Ellis" },
    { id: "2", initials: "MK", alt: "Mateo Khan" },
    { id: "3", initials: "SR", alt: "Sora Park" },
    { id: "4", initials: "AL", alt: "Ari Lindqvist" },
    { id: "5", initials: "NR", alt: "Nadia Rahman" },
  ];

  const defaultTags = ["TypeScript 7", "Svelte 5", "Tailwind 4", "WCAG AA"];
  let tags = $state([...defaultTags]);

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
        Avatars, overflow badges, deletable chips, tooltips, semantic lists, sortable tables, timelines, and tree views.
      </p>
    </div>

    <CoimTypography variant="h2">Identity, Structured Tables &amp; Hierarchy</CoimTypography>

    <ComponentDocCard
      title="Avatars, Badges, Chips & Tooltips"
      description="Compact identity clusters, bounded notification counters, filter chips, and hover/focus tooltips."
      code={COMPONENT_CODE_EXAMPLES.avatarsAndChips}
      propsDocs={[
        { name: "CoimAvatarGroup.max", type: "number", defaultValue: "5", description: "Caps visible avatars and formats overflow pill (+N)." },
        { name: "CoimBadge.badgeContent", type: "string | number", description: "Formatted against max prop (e.g. 14 with max=9 -> 9+)." },
        { name: "CoimChip.deletable", type: "boolean", defaultValue: "false", description: "Adds accessible Delete icon button wired to onDelete." },
      ]}
    >
      <CoimStack spacing={4}>
        <div class="flex flex-wrap items-center gap-6">
          <CoimAvatarGroup {avatars} max={3} />
          <CoimAvatar initials="CU" alt="CoimUI Maintainer" color="primary" />
          <CoimBadge badgeContent={14} max={9} color="error">
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
              color="primary"
              variant="pastel"
              deletable
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
    </ComponentDocCard>

    <ComponentDocCard
      title="Lists, Tables, Timelines & Tree Views"
      description="Sortable semantic tables with pagination, activity timelines, and interactive tree explorers."
      code={COMPONENT_CODE_EXAMPLES.tablesListsTrees}
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
            <CoimListItemButton onclick={() => toast.info("Opened team directory")}>
              <CoimListItemIcon><CiUser /></CoimListItemIcon>
              <CoimListItemText primary="Maintainers Directory" secondary="12 active reviewers" />
            </CoimListItemButton>
            <CoimListItem>
              <CoimListItemIcon><CiCheckSquare /></CoimListItemIcon>
              <CoimListItemText primary="Schema Frozen" secondary="Release v1.0.0 verified" />
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
              <CoimTimelineContent>v1.0.0 artifact packed</CoimTimelineContent>
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
