<script lang="ts">
  import { CoimCard, CoimCardContent, CoimCardHeader, CoimChip } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — Tokens &amp; Styling</title></svelte:head>

<DocsSubNav section="Theme" title="Design Tokens &amp; Styling" subtitle="Semantic CSS variables for color surfaces, radii, typography, and Tailwind v4 utilities.">
  <CoimCard>
    <CoimCardHeader title="Core Semantic Tokens" />
    <CoimCardContent class="flex flex-wrap gap-2">
      {#each ["--primary", "--secondary", "--background-paper", "--background", "--grey-50", "--text-primary", "--text-secondary", "--coim-font-heading", "--coim-font-body"] as tok (tok)}
        <CoimChip label={tok} size="small" variant="outlined" />
      {/each}
    </CoimCardContent>
  </CoimCard>
</DocsSubNav>
