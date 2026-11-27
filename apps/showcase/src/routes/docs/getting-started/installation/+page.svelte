<script lang="ts">
  import {
    CoimAlert,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimStack,
    CoimTab,
    CoimTabPanel,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTabs,
  } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";

  const END_SCRIPT = "</" + "script>";
  let pkgManager = $state("bun");

  const peerRows = [
    {
      subpath: "@coimui/svelte",
      required: "svelte ^5.20, tailwindcss ^4.0",
      optional: "imask (only for masked CoimTextField / CoimInput)",
      css: "@coimui/svelte/styles",
    },
    {
      subpath: "@coimui/svelte/icons",
      required: "None",
      optional: "None — 469 tree-shakeable Ci* SVGs",
      css: "Included in core styles",
    },
    {
      subpath: "@coimui/svelte/date-pickers",
      required: "None (@internationalized/date bundled)",
      optional: "None",
      css: "@coimui/svelte/styles/date-pickers.css",
    },
    {
      subpath: "@coimui/svelte/data-grid",
      required: "@tanstack/svelte-table, @tanstack/svelte-virtual, papaparse",
      optional: "exceljs (.xlsx export), @atlaskit/pragmatic-drag-and-drop (DnD)",
      css: "@coimui/svelte/styles/data-grid.css",
    },
    {
      subpath: "@coimui/svelte/charts",
      required: "layerchart, d3-array, d3-scale, d3-shape",
      optional: "None",
      css: "@coimui/svelte/styles/charts.css",
    },
    {
      subpath: "@coimui/svelte/plugins",
      required: "Install only plugins you import",
      optional: "quill, swiper, photoswipe, highlight.js, marked, dompurify, emoji-picker-element, @videojs/html, @event-calendar/core, @atlaskit/pragmatic-drag-and-drop",
      css: "@coimui/svelte/styles/plugins.css",
    },
  ];

  const viteConfigCode = `import adapter from "@sveltejs/adapter-auto";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// SvelteKit 3 configures adapters directly inside sveltekit({ ... }) in vite.config.ts (no svelte.config.js)
export default defineConfig({
  plugins: [tailwindcss(), sveltekit({ adapter: adapter() })],
});`;

  const tsconfigCode = `{
  "extends": "$app/tsconfig",
  "include": ["src", "*"],
  "compilerOptions": {
    "strict": true
  }
}`;

  const appCssCode = `@import "tailwindcss";
@import "@coimui/svelte/styles";

/* Add optional subpath stylesheets only if those modules are imported: */
@import "@coimui/svelte/styles/data-grid.css";
@import "@coimui/svelte/styles/charts.css";
@import "@coimui/svelte/styles/date-pickers.css";
@import "@coimui/svelte/styles/plugins.css";`;

  const layoutCode = `<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";
  import { CoimThemeProvider, CoimToastProvider, Elevation, THEME_OPTIONS } from "@coimui/svelte";

  let { children }: { children?: Snippet } = $props();
${END_SCRIPT}

<CoimThemeProvider
  defaults={{ themeColor: THEME_OPTIONS.PURPLE, elevation: Elevation.Elevated }}
  storagePrefix="my-app"
>
  <CoimToastProvider>
    {@render children?.()}
  </CoimToastProvider>
</CoimThemeProvider>`;

  const pageCode = `<script lang="ts">
  import { CoimButton, CoimCard, CoimCardContent, CoimCardHeader, CoimTextField, toast } from "@coimui/svelte";
  import { CiSparkle } from "@coimui/svelte/icons";

  let projectName = $state("Acme Console");
${END_SCRIPT}

<CoimCard class="mx-auto mt-8 max-w-lg">
  <CoimCardHeader title="Create Workspace" subheader="Ready with Svelte 5 runes & toast notifications" />
  <CoimCardContent class="space-y-4">
    <CoimTextField label="Workspace Name" bind:value={projectName} fullWidth />
    <CoimButton
      variant="contained"
      onclick={() => toast.success(\`Workspace "\${projectName}" ready\`)}
    >
      {#snippet startIcon()}<CiSparkle size="small" />{/snippet}
      Save Workspace
    </CoimButton>
  </CoimCardContent>
</CoimCard>`;
</script>

<svelte:head><title>CoimUI Docs — Installation</title></svelte:head>

<DocsSubNav
  section="Getting Started"
  title="Installation &amp; Setup"
  subtitle="Install @coimui/svelte, wire Tailwind v4 styles, and mount your first Svelte 5 page in minutes."
>
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader
        title="1. Install Core Package"
        subheader="Core dependencies (bits-ui, @internationalized/date, dayjs, clsx, tailwind-merge) and Mulish/Urbanist fonts ship automatically."
      />
      <CoimCardContent class="space-y-3">
        <CoimTabs bind:value={pkgManager} hairline>
          {#snippet tabs()}
            <CoimTab value="bun" label="bun" />
            <CoimTab value="npm" label="npm" />
            <CoimTab value="pnpm" label="pnpm" />
          {/snippet}
          <CoimTabPanel value="bun">
            <CoimCodeBlock language="bash" filename="terminal" code="bun add @coimui/svelte" />
          </CoimTabPanel>
          <CoimTabPanel value="npm">
            <CoimCodeBlock language="bash" filename="terminal" code="npm install @coimui/svelte" />
          </CoimTabPanel>
          <CoimTabPanel value="pnpm">
            <CoimCodeBlock language="bash" filename="terminal" code="pnpm add @coimui/svelte" />
          </CoimTabPanel>
        </CoimTabs>

        <CoimAlert severity="info">
          Peer requirements: Svelte <strong>^5.20.0</strong> (recommended <strong>^5.30+</strong>) and Tailwind CSS <strong>^4.0</strong> via <code>@tailwindcss/vite</code>.
        </CoimAlert>
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader
        title="2. Optional Subpath Peer Dependencies"
        subheader="Keep your bundle slim by installing heavy optional peers only when importing those entrypoints."
      />
      <CoimCardContent>
        <CoimTableContainer class="overflow-x-auto">
          <CoimTable size="small" aria-label="Optional subpath peer dependencies">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell>Subpath</CoimTableCell>
                <CoimTableCell>Required Peers</CoimTableCell>
                <CoimTableCell>Optional / Per-Feature Peers</CoimTableCell>
                <CoimTableCell>Stylesheet</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each peerRows as row (row.subpath)}
                <CoimTableRow>
                  <CoimTableCell class="whitespace-nowrap font-mono text-xs font-semibold">{row.subpath}</CoimTableCell>
                  <CoimTableCell class="font-mono text-xs">{row.required}</CoimTableCell>
                  <CoimTableCell class="text-sm">{row.optional}</CoimTableCell>
                  <CoimTableCell class="whitespace-nowrap font-mono text-xs">{row.css}</CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader
        title="3. Configure SvelteKit 3, Vite &amp; Stylesheets"
        subheader={"Register @tailwindcss/vite and sveltekit({ adapter }) in vite.config.ts, extend $app/tsconfig, and import semantic layers in src/app.css."}
      />
      <CoimCardContent class="space-y-4">
        <CoimCodeBlock language="typescript" filename="vite.config.ts" code={viteConfigCode} />
        <CoimCodeBlock language="json" filename="tsconfig.json" code={tsconfigCode} />
        <CoimCodeBlock language="css" filename="src/app.css" code={appCssCode} />
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader
        title="4. Minimal SvelteKit 3 + Svelte 5 App"
        subheader="Wrap your root layout with CoimThemeProvider + CoimToastProvider and render your first interactive route."
      />
      <CoimCardContent class="space-y-4">
        <CoimCodeBlock language="svelte" filename="src/routes/+layout.svelte" code={layoutCode} />
        <CoimCodeBlock language="svelte" filename="src/routes/+page.svelte" code={pageCode} />
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</DocsSubNav>
