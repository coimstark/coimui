<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimListingPageContent,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTextField,
    CoimTypography,
  } from "@coimui/svelte";
  import { COMPONENT_DIRECTORY } from "#lib/component-directory.ts";
  import { showcaseI18n } from "#lib/i18n.svelte.ts";
  import { showcaseNavItems } from "#lib/navigation.ts";

  let query = $state("");
  let selectedSubpath = $state<string>("all");

  const subpathFilters = [
    { value: "all", label: `All (${COMPONENT_DIRECTORY.length})` },
    { value: "@coimui/svelte", label: "Core (@coimui/svelte)" },
    { value: "@coimui/svelte/data-grid", label: "Data Grid" },
    { value: "@coimui/svelte/charts", label: "Charts" },
    { value: "@coimui/svelte/date-pickers", label: "Date Pickers" },
    { value: "@coimui/svelte/plugins", label: "Plugins" },
  ];

  const filteredComponents = $derived.by(() => {
    const q = query.trim().toLowerCase();
    return COMPONENT_DIRECTORY.filter((entry) => {
      if (selectedSubpath !== "all" && entry.subpath !== selectedSubpath) return false;
      if (!q) return true;
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.subpath.toLowerCase().includes(q)
      );
    });
  });
</script>

<svelte:head>
  <title>CoimUI Showcase — Component Catalog &amp; API Directory</title>
</svelte:head>

<CoimStack spacing={6}>
  <CoimTypography variant="h1">UI Component Catalog</CoimTypography>

  <CoimListingPageContent
    items={showcaseNavItems}
    currentPath="/components"
    translate={showcaseI18n.t}
    onNavigate={(href) => {
      void goto(href);
    }}
  />

  <CoimCard id="api-directory" class="scroll-mt-20">
    <CoimCardHeader
      title={`Component API Directory (${filteredComponents.length} / ${COMPONENT_DIRECTORY.length})`}
      subheader="Search every public Coim* component across @coimui/svelte and subpath packages"
    />
    <CoimCardContent class="space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div class="w-full md:max-w-sm">
          <CoimTextField
            label="Filter components"
            placeholder="e.g. CoimButton, CoimPortal, data-grid..."
            bind:value={query}
            fullWidth
          />
        </div>
        <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by package subpath">
          {#each subpathFilters as filter (filter.value)}
            <CoimButton
              size="small"
              variant={selectedSubpath === filter.value ? "contained" : "outlined"}
              onclick={() => (selectedSubpath = filter.value)}
            >
              {filter.label}
            </CoimButton>
          {/each}
        </div>
      </div>

      <CoimTableContainer class="max-h-136 overflow-x-auto overflow-y-auto">
        <CoimTable size="small" aria-label="All public CoimUI components">
          <CoimTableHead>
            <CoimTableRow>
              <CoimTableCell>Component</CoimTableCell>
              <CoimTableCell>Category</CoimTableCell>
              <CoimTableCell>Import Subpath</CoimTableCell>
              <CoimTableCell>Summary</CoimTableCell>
            </CoimTableRow>
          </CoimTableHead>
          <CoimTableBody>
            {#each filteredComponents as item (item.name)}
              <CoimTableRow hover>
                <CoimTableCell class="whitespace-nowrap font-mono text-xs font-semibold">
                  <a href={item.href} class="text-primary hover:underline">
                    {item.name}
                  </a>
                </CoimTableCell>
                <CoimTableCell class="whitespace-nowrap text-xs">{item.category}</CoimTableCell>
                <CoimTableCell class="whitespace-nowrap">
                  <CoimChip label={item.subpath} size="small" variant="pastel" color="primary" class="font-mono text-xs" />
                </CoimTableCell>
                <CoimTableCell class="text-sm">{item.summary}</CoimTableCell>
              </CoimTableRow>
            {/each}
          </CoimTableBody>
        </CoimTable>
      </CoimTableContainer>
    </CoimCardContent>
  </CoimCard>
</CoimStack>
