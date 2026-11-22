<script lang="ts">
  import {
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
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
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

  const subpaths = [
    { entry: "@coimui/svelte", styles: "@coimui/svelte/styles", purpose: "Core tokens, components, layouts, forms/Zod, and i18n navigation" },
    { entry: "@coimui/svelte/data-grid", styles: "@coimui/svelte/styles/data-grid.css", purpose: "TanStack Table v9, Virtualizer, CSV & lazy ExcelJS XLSX export" },
    { entry: "@coimui/svelte/charts", styles: "@coimui/svelte/styles/charts.css", purpose: "Ten LayerChart & D3 chart families" },
    { entry: "@coimui/svelte/date-pickers", styles: "@coimui/svelte/styles/date-pickers.css", purpose: "Calendar, range picker, segmented ISO date/time fields & clocks" },
    { entry: "@coimui/svelte/plugins", styles: "@coimui/svelte/styles/plugins.css", purpose: "Quill, Swiper, PhotoSwipe, Emoji Picker, Marked, Video.js, Event Calendar, Sortable" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Documentation</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Documentation" }]} />
    <div class="mt-2 flex flex-wrap items-center gap-3">
      <CoimTypography variant="h1">CoimUI v1.0.0 Documentation</CoimTypography>
      <CoimChip label="Svelte 5 + TypeScript 7" color="primary" variant="pastel" />
    </div>
    <p class="text-text-secondary mt-1">
      Installation, modular subpath isolation, live design system playground, and SvelteKit 3 + Vite 8 integration guides.
    </p>
  </div>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 7 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Quick Installation" subheader="Bun workspace & SvelteKit 3 setup" />
        <CoimCardContent>
          <CoimStack spacing={4}>
            <CoimCodeBlock
              language="bash"
              filename="terminal"
              code={`bun add @coimui/svelte bits-ui @internationalized/date dayjs clsx tailwind-merge\n# Optional heavy modules only where used:\nbun add @tanstack/svelte-table @tanstack/svelte-virtual papaparse exceljs`}
            />
            <CoimCodeBlock
              language="css"
              filename="src/app.css"
              code={`@import "tailwindcss";\n@import "@coimui/svelte/styles";\n/* Load optional feature styles when importing their subpaths: */\n/* @import "@coimui/svelte/styles/data-grid.css"; */`}
            />
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

  <CoimCard>
    <CoimCardHeader title="Subpath Export Architecture" subheader="Zero cross-contamination between core primitives and optional feature engines" />
    <CoimCardContent>
      <CoimTableContainer>
        <CoimTable aria-label="Package subpath architecture">
          <CoimTableHead>
            <CoimTableRow>
              <CoimTableCell>Import Path</CoimTableCell>
              <CoimTableCell>Stylesheet Subpath</CoimTableCell>
              <CoimTableCell>Capabilities</CoimTableCell>
            </CoimTableRow>
          </CoimTableHead>
          <CoimTableBody>
            {#each subpaths as item (item.entry)}
              <CoimTableRow>
                <CoimTableCell class="font-mono text-xs font-semibold">{item.entry}</CoimTableCell>
                <CoimTableCell class="font-mono text-xs">{item.styles}</CoimTableCell>
                <CoimTableCell class="text-sm">{item.purpose}</CoimTableCell>
              </CoimTableRow>
            {/each}
          </CoimTableBody>
        </CoimTable>
      </CoimTableContainer>
    </CoimCardContent>
  </CoimCard>
</CoimStack>
