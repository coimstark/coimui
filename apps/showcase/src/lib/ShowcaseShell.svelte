<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import { CoimAppShell, getThemeContext } from "@coimui/svelte";
  import { SHOWCASE_LOCALES, showcaseI18n } from "./i18n.svelte.ts";
  import { showcaseBottomNavItems, showcaseNavItems } from "./navigation.ts";

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
  const theme = getThemeContext();

  const currentPath = $derived(page.url.pathname);
  const isStandaloneAuth = $derived(currentPath.startsWith("/pages/auth"));

  function handleLocaleChange(code: string) {
    const dir = showcaseI18n.setLocale(code);
    theme.setDirection(dir);
  }
</script>

{#if isStandaloneAuth}
  {@render children?.()}
{:else}
  <CoimAppShell
    items={showcaseNavItems}
    bottomItems={showcaseBottomNavItems}
    {currentPath}
    locales={SHOWCASE_LOCALES.map((l) => ({ code: l.code, label: l.label, shortCode: l.shortCode }))}
    locale={showcaseI18n.locale}
    onLocaleChange={handleLocaleChange}
    translate={showcaseI18n.t}
    ctaHref="/docs"
    onNavigate={(href) => {
      void goto(href);
    }}
    footerLinks={[
      { label: "Components", href: "/components" },
      { label: "Data Grid", href: "/data-grid" },
      { label: "Charts", href: "/charts" },
      { label: "Docs", href: "/docs" },
    ]}
  >
    {@render children?.()}
  </CoimAppShell>
{/if}
