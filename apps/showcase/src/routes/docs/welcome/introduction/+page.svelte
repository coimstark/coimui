<script lang="ts">
  import { CoimButton, CoimCard, CoimCardContent, CoimCardHeader, CoimStack } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — Introduction</title></svelte:head>

<DocsSubNav section="Welcome" title="Introduction" subtitle="Overview of @coimui/svelte v1 packages, layouts, and Svelte 5 runes design.">
  <CoimCard>
    <CoimCardHeader title="Svelte 5 UI System &amp; Modular Subpaths" />
    <CoimCardContent class="space-y-4 text-sm leading-relaxed">
      <p>
        <strong>@coimui/svelte</strong> pairs accessible Bits UI primitives and Tailwind v4 semantic design tokens with dedicated subpaths for DataGrid (<code>@coimui/svelte/data-grid</code>), Charts (<code>@coimui/svelte/charts</code>), Date Pickers (<code>@coimui/svelte/date-pickers</code>), and rich client plugins (<code>@coimui/svelte/plugins</code>).
      </p>
      <p class="text-text-secondary">
        Applications share a reactive layout shell (<code>CoimAppShell</code>) supporting Minimal, Comfort, and Single-Layer navigation modes alongside instant Light/Dark themes and LTR/RTL synchronization.
      </p>
      <CoimStack direction="row" spacing={2}>
        <CoimButton href="/docs/getting-started/installation" size="small" variant="contained">
          Get Started
        </CoimButton>
        <CoimButton href="/components" size="small" variant="outlined">
          Browse 185 Components
        </CoimButton>
      </CoimStack>
    </CoimCardContent>
  </CoimCard>
</DocsSubNav>
