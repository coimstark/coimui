<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimStack,
    CoimTextField,
    CoimTypography,
  } from "@coimui/svelte";
  import { CoimVideoPlayer } from "@coimui/svelte/plugins";

  let query = $state("");
  const guides = [
    { id: "kb-1", category: "Getting Started", title: "Subpath Package Imports", summary: "Import styles selectively from @coimui/svelte/styles/*.css.", href: "/docs/getting-started/installation" },
    { id: "kb-2", category: "Theming", title: "Color Presets & RTL Sync", summary: "Configure Purple, Blue, Green, Orange & Arabic RTL direction.", href: "/docs/theme/theme-provider" },
    { id: "kb-3", category: "Components", title: "Enterprise DataGrid Pivots", summary: "Configure row fields, column groups & full-row editing.", href: "/data-grid" },
  ];

  const matching = $derived(
    guides.filter((g) => !query.trim() || g.title.toLowerCase().includes(query.trim().toLowerCase())),
  );
</script>

<svelte:head>
  <title>CoimUI Showcase — Knowledge Base</title>
</svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Miscellaneous", href: "/pages/miscellaneous" }, { label: "Knowledge Base" }]} />
    <CoimTypography variant="h1" class="mt-2">Help &amp; Knowledge Base</CoimTypography>
    <p class="text-text-secondary mt-1 text-sm">Browse tutorials, architecture guides, and quick video walkthroughs.</p>
  </div>

  <CoimTextField label="Search knowledge base" placeholder="Filter guides..." bind:value={query} fullWidth />

  <CoimGrid container spacing={4}>
    {#each matching as g (g.id)}
      <CoimGrid size={{ xs: 12, md: 4 }}>
        <CoimCard class="flex h-full flex-col justify-between">
          <div>
            <CoimCardHeader title={g.title} subheader={g.category} />
            <CoimCardContent>
              <p class="text-text-secondary text-sm">{g.summary}</p>
            </CoimCardContent>
          </div>
          <CoimCardContent>
            <CoimButton href={g.href} size="small" variant="outlined">Read Guide</CoimButton>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>

  <CoimCard>
    <CoimCardHeader title="Platform Walkthrough Clip" subheader="Product showcase video preview" />
    <CoimCardContent>
      <CoimVideoPlayer src="/videos/products/product-1.mp4" poster="/images/misc/screen-1.jpg" />
    </CoimCardContent>
  </CoimCard>
</CoimStack>
