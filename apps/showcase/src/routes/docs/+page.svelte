<script lang="ts">
  import {
    COIMUI_VERSION,
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimFormControlLabel,
    CoimGrid,
    CoimSelect,
    CoimStack,
    CoimSwitch,
    CoimTab,
    CoimTabPanel,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTabs,
    CoimTypography,
    ContentType,
    Elevation,
    THEME_OPTIONS,
    TopNavType,
    getThemeContext,
    type ThemeVariant,
  } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";

  const theme = getThemeContext();
  let pkgManager = $state("bun");

  const installCommands: Record<string, string> = {
    bun: "bun add @coimui/svelte",
    npm: "npm install @coimui/svelte",
    pnpm: "pnpm add @coimui/svelte",
  };

  const END_SCRIPT = "</" + "script>";

  const starterSnippet = `<script lang="ts">
  import { CoimButton, CoimCard, CoimCardContent, CoimThemeProvider, CoimToastProvider, Elevation, THEME_OPTIONS, toast } from "@coimui/svelte";
  import { CiSparkle } from "@coimui/svelte/icons";
${END_SCRIPT}

<CoimThemeProvider defaults={{ themeColor: THEME_OPTIONS.PURPLE, elevation: Elevation.Elevated }}>
  <CoimToastProvider>
    <CoimCard class="max-w-md p-6">
      <CoimCardContent class="flex items-center justify-between gap-4">
        <span>CoimUI ready</span>
        <CoimButton variant="contained" onclick={() => toast.success("Ready to build!")}>
          {#snippet startIcon()}<CiSparkle size="small" />{/snippet}
          Launch
        </CoimButton>
      </CoimCardContent>
    </CoimCard>
  </CoimToastProvider>
</CoimThemeProvider>`;

  const subpaths = [
    { entry: "@coimui/svelte", styles: "@coimui/svelte/styles", peers: "None (svelte + tailwindcss)", purpose: "Core components, design tokens, theme context, layouts, forms & utilities" },
    { entry: "@coimui/svelte/icons", styles: "Included in core", peers: "None", purpose: "469 outlined/contained UI icons & SVG illustrations (tree-shakeable)" },
    { entry: "@coimui/svelte/data-grid", styles: "@coimui/svelte/styles/data-grid.css", peers: "@tanstack/svelte-table, @tanstack/svelte-virtual, papaparse, @atlaskit/pragmatic-drag-and-drop", purpose: "Filtering, inline/row editing, column groups, pivot, translate i18n & CSV/XLSX" },
    { entry: "@coimui/svelte/charts", styles: "@coimui/svelte/styles/charts.css", peers: "layerchart, d3-array, d3-scale, d3-shape", purpose: "Ten LayerChart & D3 chart families + interactive CoimChartLegend" },
    { entry: "@coimui/svelte/date-pickers", styles: "@coimui/svelte/styles/date-pickers.css", peers: "None (@internationalized/date bundled)", purpose: "Calendar, range picker, segmented ISO date/time fields & clocks" },
    { entry: "@coimui/svelte/plugins", styles: "@coimui/svelte/styles/plugins.css", peers: "Optional per plugin (quill, marked, etc.)", purpose: "Quill editor, Swiper carousel, PhotoSwipe, Emoji Picker, CodeBlock & Event Calendar" },
  ];

  const guideLinks = [
    { title: "Installation & Setup", desc: "Package manager commands, peer matrix, Tailwind v4 & SvelteKit 3", href: "/docs/getting-started/installation" },
    { title: "CoimThemeProvider", desc: "Svelte 5 snippet wrapping, getThemeContext() & zero-FOUC script", href: "/docs/theme/theme-provider" },
    { title: "Tokens & Dark Mode", desc: "Semantic CSS variables, contrast foregrounds & custom brand accents", href: "/docs/theme/styling" },
    { title: "Routing & App Shell", desc: "CoimAppShell navigation config & Layouts API reference", href: "/docs/getting-started/routing-and-menu" },
    { title: "Utilities & Transitions", desc: "CoimPortal, CoimClickAwayListener, transitions & helper hooks", href: "/components/utilities" },
    { title: "Component API Directory", desc: "Searchable index across all 185 exported Coim* components", href: "/components" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Documentation</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Documentation" }]} />
    <div class="mt-2 flex flex-wrap items-center gap-3">
      <CoimTypography variant="h1">CoimUI v{COIMUI_VERSION} Documentation</CoimTypography>
      <CoimChip label="Svelte 5 Runes + Tailwind v4" color="primary" variant="pastel" />
    </div>
    <p class="text-text-secondary mt-1">
      Code-first guides, accurate TypeScript API references, and live component playgrounds for SvelteKit 3 + Vite.
    </p>
  </div>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 7 }}>
      <CoimCard class="h-full">
        <CoimCardHeader
          title="Quick Start"
          subheader="bits-ui, @internationalized/date, dayjs, clsx, and tailwind-merge are bundled automatically"
        >
          {#snippet action()}
            <CoimButton href="/docs/getting-started/installation" size="small" variant="outlined">
              Full Setup Guide
            </CoimButton>
          {/snippet}
        </CoimCardHeader>
        <CoimCardContent>
          <CoimStack spacing={4}>
            <CoimTabs bind:value={pkgManager} hairline>
              {#snippet tabs()}
                <CoimTab value="bun" label="bun" />
                <CoimTab value="npm" label="npm" />
                <CoimTab value="pnpm" label="pnpm" />
              {/snippet}
              <CoimTabPanel value="bun">
                <CoimCodeBlock language="bash" filename="terminal" code={installCommands.bun} />
              </CoimTabPanel>
              <CoimTabPanel value="npm">
                <CoimCodeBlock language="bash" filename="terminal" code={installCommands.npm} />
              </CoimTabPanel>
              <CoimTabPanel value="pnpm">
                <CoimCodeBlock language="bash" filename="terminal" code={installCommands.pnpm} />
              </CoimTabPanel>
            </CoimTabs>

            <CoimCodeBlock
              language="css"
              filename="src/app.css"
              code={`@import "tailwindcss";\n@import "@coimui/svelte/styles";\n/* Load optional feature stylesheets only where their subpaths are used: */\n/* @import "@coimui/svelte/styles/data-grid.css"; */`}
            />

            <CoimCodeBlock language="svelte" filename="src/routes/+layout.svelte" code={starterSnippet} />
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 5 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Live Theme Playground" subheader="Mutates persisted CoimThemeProvider tokens" />
        <CoimCardContent>
          <CoimStack spacing={4}>
            <CoimSelect
              label="Accent Palette"
              value={theme.theme}
              onValueChange={(next) => {
                if (typeof next === "string") theme.setTheme(next as ThemeVariant);
              }}
              options={[
                { value: THEME_OPTIONS.PURPLE, label: "Purple (Default)" },
                { value: THEME_OPTIONS.BLUE, label: "Blue" },
                { value: THEME_OPTIONS.GREEN, label: "Green" },
                { value: THEME_OPTIONS.ORANGE, label: "Orange" },
              ]}
              fullWidth
            />

            <CoimFormControlLabel label="Dark Color Scheme">
              <CoimSwitch
                checked={theme.isDarkMode}
                onCheckedChange={(dark) => theme.setMode(dark ? "dark" : "light")}
              />
            </CoimFormControlLabel>

            <CoimFormControlLabel label="Right-to-Left (RTL) Writing Mode">
              <CoimSwitch
                checked={theme.direction === "rtl"}
                onCheckedChange={(rtl) => theme.setDirection(rtl ? "rtl" : "ltr")}
              />
            </CoimFormControlLabel>

            <CoimFormControlLabel label="Flat Paper Surface Elevation">
              <CoimSwitch
                checked={theme.elevation === Elevation.Flat}
                onCheckedChange={(flat) => theme.setElevation(flat ? Elevation.Flat : Elevation.Elevated)}
              />
            </CoimFormControlLabel>

            <div class="flex flex-wrap gap-2">
              <CoimButton
                size="small"
                variant={theme.content === ContentType.Fluid ? "contained" : "outlined"}
                onclick={() => theme.setContent(ContentType.Fluid)}
              >
                Fluid Content
              </CoimButton>
              <CoimButton
                size="small"
                variant={theme.content === ContentType.Boxed ? "contained" : "outlined"}
                onclick={() => theme.setContent(ContentType.Boxed)}
              >
                Boxed Content
              </CoimButton>
              <CoimButton
                size="small"
                variant={theme.topNav === TopNavType.Full ? "contained" : "outlined"}
                onclick={() => theme.setTopNav(theme.topNav === TopNavType.Full ? TopNavType.Contained : TopNavType.Full)}
              >
                Toggle Top Nav Width
              </CoimButton>
            </div>
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>

  <CoimGrid container spacing={3}>
    {#each guideLinks as guide (guide.href)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 4 }}>
        <CoimCard class="h-full">
          <CoimCardHeader title={guide.title} subheader={guide.desc} />
          <CoimCardContent>
            <CoimButton href={guide.href} size="small" variant="outlined">Open Guide</CoimButton>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>

  <CoimCard>
    <CoimCardHeader title="Subpath Export Architecture" subheader="Zero cross-contamination between core primitives and optional feature engines" />
    <CoimCardContent>
      <CoimTableContainer class="overflow-x-auto">
        <CoimTable aria-label="Package subpath architecture">
          <CoimTableHead>
            <CoimTableRow>
              <CoimTableCell>Import Path</CoimTableCell>
              <CoimTableCell>Stylesheet Subpath</CoimTableCell>
              <CoimTableCell>Extra Peer Dependencies</CoimTableCell>
              <CoimTableCell>Capabilities</CoimTableCell>
            </CoimTableRow>
          </CoimTableHead>
          <CoimTableBody>
            {#each subpaths as item (item.entry)}
              <CoimTableRow>
                <CoimTableCell class="whitespace-nowrap font-mono text-xs font-semibold">{item.entry}</CoimTableCell>
                <CoimTableCell class="whitespace-nowrap font-mono text-xs">{item.styles}</CoimTableCell>
                <CoimTableCell class="font-mono text-xs">{item.peers}</CoimTableCell>
                <CoimTableCell class="text-sm">{item.purpose}</CoimTableCell>
              </CoimTableRow>
            {/each}
          </CoimTableBody>
        </CoimTable>
      </CoimTableContainer>
    </CoimCardContent>
  </CoimCard>
</CoimStack>
