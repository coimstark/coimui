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

  const END_SCRIPT = "</" + "script>";

  const providerSnippet = `<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";
  import {
    CoimThemeProvider,
    CoimToastProvider,
    ContentType,
    Elevation,
    THEME_OPTIONS,
    TopNavType,
  } from "@coimui/svelte";

  let { children }: { children?: Snippet } = $props();
${END_SCRIPT}

<CoimThemeProvider
  storagePrefix="coimui-app"
  persist={true}
  defaults={{
    themeColor: THEME_OPTIONS.PURPLE,
    themeMode: "system",
    elevation: Elevation.Elevated,
    contentType: ContentType.Boxed,
    topNavType: TopNavType.Contained,
  }}
>
  <CoimToastProvider>
    {@render children?.()}
  </CoimToastProvider>
</CoimThemeProvider>`;

  const consumeContextSnippet = `<script lang="ts">
  import { CoimButton, Elevation, THEME_OPTIONS, getThemeContext } from "@coimui/svelte";

  const theme = getThemeContext();
${END_SCRIPT}

<div class="flex flex-wrap gap-2">
  <CoimButton size="small" onclick={() => theme.setMode(theme.isDarkMode ? "light" : "dark")}>
    Active mode: {theme.resolvedMode}
  </CoimButton>
  <CoimButton size="small" variant="outlined" onclick={() => theme.setTheme(THEME_OPTIONS.BLUE)}>
    Switch to Blue
  </CoimButton>
  <CoimButton size="small" variant="text" onclick={() => theme.setElevation(Elevation.Flat)}>
    Flat Surface
  </CoimButton>
</div>`;

  const initScriptSnippet = `import { getThemeInitScript, THEME_OPTIONS, Elevation } from "@coimui/svelte";

// Outputs a compact inline <script> body to run in <head> before body paint:
const inlineThemeScript = getThemeInitScript({
  storagePrefix: "coimui-app",
  defaultTheme: THEME_OPTIONS.PURPLE,
  defaultMode: "system",
  defaultElevation: Elevation.Elevated,
});`;

  const providerProps = [
    { name: "defaults", type: "Partial<ThemeConfigDefaults>", defaultValue: "DEFAULT_THEME_CONFIG", description: "Initial palette (themeColor), mode (themeMode), elevation, contentType, topNavType, leftMenuType, and breakpoints." },
    { name: "storagePrefix", type: "string", defaultValue: "\"coimui\"", description: "LocalStorage key prefix (e.g. coimui-theme-color, coimui-theme-mode)." },
    { name: "persist", type: "boolean", defaultValue: "true", description: "Reads/writes user selections in window.localStorage on mount and updates." },
    { name: "direction", type: "\"ltr\" | \"rtl\"", defaultValue: "Derived from locale", description: "Overrides reactive document dir attribute (\"ltr\" or \"rtl\")." },
    { name: "children", type: "Snippet", defaultValue: "—", description: "Svelte 5 snippet rendered inside the provider context ({@render children?.()})." },
  ];

  const contextMembers = [
    { name: "theme / setTheme(v)", type: "ThemeVariant", description: "Active palette: THEME_OPTIONS.PURPLE | BLUE | GREEN | ORANGE." },
    { name: "mode / setMode(v)", type: "\"light\" | \"dark\" | \"system\"", description: "Preferred color mode; persisted to localStorage when persist is true." },
    { name: "resolvedMode / isDarkMode", type: "\"light\" | \"dark\" / boolean", description: "Derived resolved mode taking OS prefers-color-scheme into account." },
    { name: "elevation / setElevation(v)", type: "Elevation", description: "Surface appearance: Elevation.Elevated | Elevation.Flat." },
    { name: "content / setContent(v)", type: "ContentType", description: "Main container width: ContentType.Boxed | ContentType.Fluid." },
    { name: "topNav / setTopNav(v)", type: "TopNavType", description: "Header width: TopNavType.Contained | TopNavType.Full." },
    { name: "direction / setDirection(v)", type: "\"ltr\" | \"rtl\"", description: "Syncs <html dir=\"...\"> for bidirectional layouts." },
    { name: "isMobile / reset()", type: "boolean / () => void", description: "Reactive mobile menu breakpoint state and helper to reset all preferences to defaults." },
  ];
</script>

<svelte:head><title>CoimUI Docs — Theme Provider</title></svelte:head>

<DocsSubNav
  section="Theme"
  title="CoimThemeProvider &amp; ThemeState"
  subtitle="Root Svelte 5 context orchestrating persisted palette, light/dark mode, direction, elevation, and layout width."
>
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader title="1. Root Layout Wrapping (Svelte 5)">
        {#snippet action()}
          <CoimChip label="@coimui/svelte/theme" size="small" variant="pastel" color="primary" class="font-mono text-xs" />
        {/snippet}
      </CoimCardHeader>
      <CoimCardContent>
        <CoimCodeBlock language="svelte" filename="src/routes/+layout.svelte" code={providerSnippet} />
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader
        title="2. Consuming &amp; Mutating Theme State"
        subheader="Use getThemeContext() inside any child component, or tryGetThemeContext() when optional."
      />
      <CoimCardContent>
        <CoimCodeBlock language="svelte" filename="ThemeToggleBar.svelte" code={consumeContextSnippet} />
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader
        title="3. Zero-FOUC Initialization Script"
        subheader="Match your storagePrefix with getThemeInitScript() to apply theme classes before first paint in SSR/static builds."
      />
      <CoimCardContent>
        <CoimCodeBlock language="typescript" filename="hooks.server.ts / app.html helper" code={initScriptSnippet} />
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader title="API Reference — CoimThemeProvider &amp; ThemeState" />
      <CoimCardContent class="space-y-5">
        <CoimTableContainer class="overflow-x-auto">
          <CoimTable size="small" aria-label="CoimThemeProvider props">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell>Prop</CoimTableCell>
                <CoimTableCell>Type</CoimTableCell>
                <CoimTableCell>Default</CoimTableCell>
                <CoimTableCell>Description</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each providerProps as row (row.name)}
                <CoimTableRow>
                  <CoimTableCell class="whitespace-nowrap font-mono text-xs font-semibold">{row.name}</CoimTableCell>
                  <CoimTableCell class="font-mono text-xs">{row.type}</CoimTableCell>
                  <CoimTableCell class="font-mono text-xs">{row.defaultValue}</CoimTableCell>
                  <CoimTableCell class="text-sm">{row.description}</CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>

        <CoimTableContainer class="overflow-x-auto">
          <CoimTable size="small" aria-label="ThemeState context members">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell>ThemeState Member</CoimTableCell>
                <CoimTableCell>Type</CoimTableCell>
                <CoimTableCell>Behavior</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each contextMembers as row (row.name)}
                <CoimTableRow>
                  <CoimTableCell class="whitespace-nowrap font-mono text-xs font-semibold">{row.name}</CoimTableCell>
                  <CoimTableCell class="font-mono text-xs">{row.type}</CoimTableCell>
                  <CoimTableCell class="text-sm">{row.description}</CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</DocsSubNav>
