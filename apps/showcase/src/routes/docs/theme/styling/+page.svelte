<script lang="ts">
  import {
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
  } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";

  const tokenGroups = [
    { group: "Surfaces", tokens: "--background, --background-paper, --grey-20 .. --grey-900", notes: "Adaptive HSL canvas & surface steps across .light and .dark." },
    { group: "Text Ink", tokens: "--text-primary, --text-secondary, --text-disabled, --text-contrast", notes: "High-contrast foreground tokens calibrated for WCAG 2.1 AA in both modes." },
    { group: "Semantic Accents", tokens: "--primary, --secondary, --accent-1..4, --success, --error, --warning, --info", notes: "Driven by .theme-purple, .theme-blue, .theme-green, or .theme-orange on <html>." },
    { group: "AA Contrast Ink", tokens: "--primary-fg, --secondary-fg, --primary-pastel-fg, --primary-contrast", notes: "Dark-mode safe ink and pastel foreground overrides preserving >= 4.5:1 text contrast." },
    { group: "Typography & Radii", tokens: "--coim-font-heading, --coim-font-body, --border-radius-xs .. --border-radius-3xl", notes: "Urbanist display headings, Mulish UI copy, and rounded surface scale." },
  ];

  const overrideCss = `/* Custom brand override placed AFTER @import "@coimui/svelte/styles"; */
.theme-purple {
  --primary: 262 83% 56%;
  --primary-dark: 262 83% 44%;
  --primary-fg: 262 83% 56%;
}

.dark.theme-purple {
  --primary-fg: 262 90% 78%;
  --primary-pastel-fg: 262 90% 82%;
}`;
</script>

<svelte:head><title>CoimUI Docs — Tokens &amp; Styling</title></svelte:head>

<DocsSubNav
  section="Theme"
  title="Design Tokens &amp; Styling"
  subtitle="Semantic CSS variables for surfaces, WCAG AA ink contrast, palette classes, typography, and Tailwind v4 utilities."
>
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader
        title="Theme Presets &amp; Contrast Architecture"
        subheader="Combine one palette class with .light/.dark and .elevated/.flat on documentElement"
      />
      <CoimCardContent class="flex flex-wrap gap-2">
        {#each ["theme-purple", "theme-blue", "theme-green", "theme-orange", "light", "dark", "elevated", "flat"] as cls (cls)}
          <CoimChip label={`.${cls}`} size="small" variant="pastel" color={cls.startsWith("theme-") ? "primary" : "secondary"} class="font-mono text-xs" />
        {/each}
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader title="Core Semantic CSS Tokens" />
      <CoimCardContent>
        <CoimTableContainer class="overflow-x-auto">
          <CoimTable size="small" aria-label="Semantic CSS design tokens">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell>Token Group</CoimTableCell>
                <CoimTableCell>CSS Variables</CoimTableCell>
                <CoimTableCell>Usage</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each tokenGroups as row (row.group)}
                <CoimTableRow>
                  <CoimTableCell class="whitespace-nowrap font-semibold text-xs">{row.group}</CoimTableCell>
                  <CoimTableCell class="font-mono text-xs">{row.tokens}</CoimTableCell>
                  <CoimTableCell class="text-sm">{row.notes}</CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader
        title="Custom Token Overrides"
        subheader="Tokens store bare HSL components (H S% L%) so Tailwind opacity utilities work automatically"
      />
      <CoimCardContent>
        <CoimCodeBlock language="css" filename="src/app.css" code={overrideCss} />
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</DocsSubNav>
