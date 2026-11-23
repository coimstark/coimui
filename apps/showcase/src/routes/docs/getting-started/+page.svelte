<script lang="ts">
  import { CoimButton, CoimCard, CoimCardContent, CoimCardHeader, CoimGrid } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — Getting Started</title></svelte:head>

<DocsSubNav section="Getting Started" title="Getting Started" subtitle="Install dependencies, inspect project folders, wire navigation, and enable locales.">
  <CoimGrid container spacing={4}>
    {#each [
      { title: "Installation", href: "/docs/getting-started/installation" },
      { title: "File Structure", href: "/docs/getting-started/file-structure" },
      { title: "Routing & Menu", href: "/docs/getting-started/routing-and-menu" },
      { title: "Multi-Language & RTL", href: "/docs/getting-started/multi-language" },
    ] as item (item.href)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard>
          <CoimCardHeader title={item.title} />
          <CoimCardContent><CoimButton href={item.href} size="small" variant="outlined">Open Guide</CoimButton></CoimCardContent>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</DocsSubNav>
