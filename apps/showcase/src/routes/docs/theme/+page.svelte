<script lang="ts">
  import { CoimButton, CoimCard, CoimCardContent, CoimCardHeader, CoimGrid } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — Theme Guide</title></svelte:head>

<DocsSubNav section="Theme" title="Theme &amp; Design Tokens" subtitle="Presets, elevation modes, width options, and CSS variables.">
  <CoimGrid container spacing={4}>
    {#each [
      { title: "Theme Provider", href: "/docs/theme/theme-provider" },
      { title: "Live Theme Settings", href: "/docs/theme/settings" },
      { title: "CSS Tokens & Styling", href: "/docs/theme/styling" },
    ] as card (card.href)}
      <CoimGrid size={{ xs: 12, md: 4 }}>
        <CoimCard>
          <CoimCardHeader title={card.title} />
          <CoimCardContent><CoimButton href={card.href} size="small" variant="contained">Explore</CoimButton></CoimCardContent>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</DocsSubNav>
