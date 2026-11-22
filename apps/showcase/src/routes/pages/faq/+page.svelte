<script lang="ts">
  import {
    CoimAccordion,
    CoimAccordionDetails,
    CoimAccordionGroup,
    CoimAccordionSummary,
    CoimBreadcrumbs,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";

  const faqs = [
    {
      id: "q1",
      q: "Why does CoimUI separate data-grid, charts, date-pickers, and plugins into subpaths?",
      a: "Separating heavy charting, spreadsheet export, rich text, and calendar engines keeps minimal consumer applications tiny while giving teams full access to every subpath when needed.",
    },
    {
      id: "q2",
      q: "Does CoimUI depend on external UI framework runtimes?",
      a: "No. Every primitive, icon, illustration, layout shell, form adapter, and advanced plugin in CoimUI is natively authored in Svelte 5 with runes and TypeScript 7.",
    },
    {
      id: "q3",
      q: "How are dark mode, accent themes, and RTL supported?",
      a: "CoimThemeProvider persists mode (light/dark/system), 4 accent variants (Purple, Blue, Green, Orange), content width, card elevation, and RTL direction synchronously to root CSS classes.",
    },
    {
      id: "q4",
      q: "Are CoimUI components safe for SSR and SvelteKit hydration?",
      a: "Yes. Every core component and optional subpath renders clean deterministic HTML on the server, while heavy browser-only editors and galleries initialize inside guarded client effects.",
    },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Frequently Asked Questions</title>
</svelte:head>

<CoimStack spacing={6} class="max-w-3xl">
  <div>
    <CoimBreadcrumbs items={[{ label: "Pages", href: "/" }, { label: "FAQ" }]} />
    <CoimTypography variant="h1" class="mt-2">Frequently Asked Questions</CoimTypography>
    <p class="text-text-secondary mt-1">Common architectural and integration answers for CoimUI v1.0.0.</p>
  </div>

  <CoimTypography variant="h2">Architecture, Theming &amp; SSR</CoimTypography>

  <CoimAccordionGroup type="single" value="q1" variant="bordered">
    {#each faqs as item (item.id)}
      <CoimAccordion value={item.id}>
        <CoimAccordionSummary>{item.q}</CoimAccordionSummary>
        <CoimAccordionDetails>{item.a}</CoimAccordionDetails>
      </CoimAccordion>
    {/each}
  </CoimAccordionGroup>
</CoimStack>
