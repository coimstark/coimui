<script lang="ts">
  import { CoimButton, CoimCard, CoimCardContent, CoimCardHeader, CoimStack, getThemeContext, toast } from "@coimui/svelte";
  import { CoimCodeBlock } from "@coimui/svelte/plugins";
  import DocsSubNav from "#lib/components/DocsSubNav.svelte";
  import { showcaseI18n, SHOWCASE_LOCALES } from "#lib/i18n.svelte.ts";

  const theme = getThemeContext();
  const END_SCRIPT = "</" + "script>";

  const appShellI18nCode = `<script lang="ts">
  import { CoimAppShell, getThemeContext } from "@coimui/svelte";

  const theme = getThemeContext();
  let locale = $state("en");

  const dict: Record<string, Record<string, string>> = {
    en: { "menu-home": "Home", "data-grid-search-placeholder": "Search..." },
    ar: { "menu-home": "الرئيسية", "data-grid-search-placeholder": "بحث..." },
  };
  const translate = (key: string) => dict[locale]?.[key] ?? key;

  function onLocaleChange(next: string) {
    locale = next;
    theme.setDirection(next === "ar" ? "rtl" : "ltr");
  }
${END_SCRIPT}

<CoimAppShell
  items={[{ id: "home", label: "menu-home", href: "/" }]}
  currentPath="/"
  {locale}
  locales={[
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ]}
  {onLocaleChange}
  {translate}
/>`;

  const gridI18nCode = `<script lang="ts">
  import {
    CoimDataGrid,
    DEFAULT_DATA_GRID_LABELS,
    resolveDataGridLabel,
  } from "@coimui/svelte/data-grid";

  // Partial override falls back cleanly to DEFAULT_DATA_GRID_LABELS for untouched keys
  const translateGrid = (key: string) =>
    customDictionary[key] ?? DEFAULT_DATA_GRID_LABELS[key] ?? key;
${END_SCRIPT}

<CoimDataGrid {rows} {columns} translate={translateGrid} />`;
</script>

<svelte:head><title>CoimUI Docs — Multi-Language &amp; RTL</title></svelte:head>

<DocsSubNav
  section="Getting Started"
  title="Localization &amp; RTL Sync"
  subtitle="Switch locales dynamically, sync Arabic RTL layout direction, and translate CoimDataGrid labels natively."
>
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader
        title="Live Locale &amp; Direction Switcher"
        subheader={`Active locale: ${showcaseI18n.locale.toUpperCase()} (${theme.direction.toUpperCase()})`}
      />
      <CoimCardContent>
        <div class="flex flex-wrap gap-2">
          {#each SHOWCASE_LOCALES as loc (loc.code)}
            <CoimButton
              size="small"
              variant={showcaseI18n.locale === loc.code ? "contained" : "outlined"}
              onclick={() => {
                const dir = showcaseI18n.setLocale(loc.code);
                theme.setDirection(dir);
                toast.success(`Switched to ${loc.label} (${dir.toUpperCase()})`);
              }}
            >
              {loc.label}
            </CoimButton>
          {/each}
        </div>
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader
        title="App Shell Localization &amp; RTL Direction"
        subheader="Pass translate, locales, and onLocaleChange to CoimAppShell"
      />
      <CoimCardContent>
        <CoimCodeBlock language="svelte" filename="LocalizedShell.svelte" code={appShellI18nCode} />
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader
        title="Native Data Grid i18n (v1.1.0)"
        subheader="Translate toolbar, filter placeholders, aggregations, pagination, pivot panel, and AI bar via one translate prop"
      />
      <CoimCardContent>
        <CoimCodeBlock language="svelte" filename="LocalizedGrid.svelte" code={gridI18nCode} />
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</DocsSubNav>
