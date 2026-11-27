<script lang="ts">
  import { CoimAccordion, CoimAccordionDetails, CoimAccordionGroup, CoimAccordionSummary } from "@coimui/svelte";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
</script>

<svelte:head><title>CoimUI Docs — FAQ</title></svelte:head>

<DocsSubNav section="Welcome" title="Developer FAQ" subtitle="Answers covering bundle splitting, Tailwind v4 tokens, and SvelteKit SSR.">
  <CoimAccordionGroup type="single" value="df-1" variant="bordered">
    <CoimAccordion value="df-1">
      <CoimAccordionSummary>Does <code>@coimui/svelte</code> require chart or Excel dependencies upfront?</CoimAccordionSummary>
      <CoimAccordionDetails>
        No. Core primitives bundle zero chart or spreadsheet code. Import subpaths like <code>@coimui/svelte/data-grid</code> or <code>@coimui/svelte/charts</code> only in routes that mount them.
      </CoimAccordionDetails>
    </CoimAccordion>
    <CoimAccordion value="df-2">
      <CoimAccordionSummary>Is SSR &amp; static prerendering safe across DataGrid, Pickers, and Plugins?</CoimAccordionSummary>
      <CoimAccordionDetails>
        Yes. Browser-only DOM integrations run strictly inside guarded <code>$effect</code> blocks and are verified with automated SSR tests and static builds.
      </CoimAccordionDetails>
    </CoimAccordion>
    <CoimAccordion value="df-3">
      <CoimAccordionSummary>How do I avoid a theme flash on initial page load?</CoimAccordionSummary>
      <CoimAccordionDetails>
        Call <code>getThemeInitScript()</code> with the same <code>storagePrefix</code> passed to <code>CoimThemeProvider</code> and execute it inside <code>app.html</code> before first paint.
      </CoimAccordionDetails>
    </CoimAccordion>
  </CoimAccordionGroup>
</DocsSubNav>
