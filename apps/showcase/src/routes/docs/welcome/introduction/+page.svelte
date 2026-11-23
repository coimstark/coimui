<script lang="ts">
  import { CoimCard, CoimCardContent, CoimCardHeader } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — Introduction</title></svelte:head>

<DocsSubNav section="Welcome" title="Introduction" subtitle="Overview of @coimui/svelte v1 packages, layouts, and Svelte 5 runes design.">
  <CoimCard>
    <CoimCardHeader title="First-Generation Svelte 5 UI Ecosystem" />
    <CoimCardContent class="space-y-3 text-sm leading-relaxed">
      <p>
        <strong>@coimui/svelte</strong> pairs accessible Bits UI primitives and Tailwind v4 semantic design tokens with dedicated subpaths for DataGrid (`@coimui/svelte/data-grid`), Charts (`@coimui/svelte/charts`), Date Pickers (`@coimui/svelte/date-pickers`), and rich client plugins (`@coimui/svelte/plugins`).
      </p>
      <p class="text-text-secondary">
        Both Showcase and Starter apps share one reactive layout shell (`CoimAppShell`) supporting Minimal, Comfort, and Single-Layer navigation modes alongside instant Light/Dark and LTR/RTL synchronization.
      </p>
    </CoimCardContent>
  </CoimCard>
</DocsSubNav>
