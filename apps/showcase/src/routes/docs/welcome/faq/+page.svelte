<script lang="ts">
  import { CoimAccordion, CoimAccordionDetails, CoimAccordionGroup, CoimAccordionSummary } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — FAQ</title></svelte:head>

<DocsSubNav section="Welcome" title="Developer FAQ" subtitle="Answers covering bundle splitting, TypeScript 7, and SvelteKit SSR.">
  <CoimAccordionGroup type="single" value="df-1" variant="bordered">
    <CoimAccordion value="df-1">
      <CoimAccordionSummary>Does `@coimui/svelte` require optional chart or Excel dependencies upfront?</CoimAccordionSummary>
      <CoimAccordionDetails>No. Only import subpaths like `@coimui/svelte/data-grid` or `@coimui/svelte/charts` in routes that mount them.</CoimAccordionDetails>
    </CoimAccordion>
    <CoimAccordion value="df-2">
      <CoimAccordionSummary>Is SSR safe across DataGrid, Pickers, and Plugins?</CoimAccordionSummary>
      <CoimAccordionDetails>Yes. Heavy DOM plugins initialize strictly in guarded browser `$effect` blocks and are covered by automated Vitest SSR tests.</CoimAccordionDetails>
    </CoimAccordion>
  </CoimAccordionGroup>
</DocsSubNav>
