<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import {
    CoimAppShell,
    getThemeContext,
    type CoimNavItem,
  } from "@coimui/svelte";
  import { starterI18n, SUPPORTED_LOCALES } from "./i18n.svelte.ts";

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
  const theme = getThemeContext();

  const currentPath = $derived(page.url.pathname);
  const isAuthRoute = $derived(currentPath.startsWith("/auth"));

  const navItems: CoimNavItem[] = [
    {
      id: "overview",
      label: "nav-overview",
      icon: "CiHome",
      href: "/",
      children: [
        {
          id: "dashboard",
          label: "nav-dashboard",
          description: "Key metrics and activity stream",
          icon: "CiChartPie",
          href: "/",
        },
        {
          id: "projects",
          label: "nav-projects",
          description: "Filterable workspace records",
          icon: "CiFolder",
          href: "/projects",
        },
      ],
    },
    {
      id: "forms",
      label: "nav-forms",
      icon: "CiPenSquare",
      href: "/forms",
      children: [
        {
          id: "validated-form",
          label: "nav-forms",
          description: "Zod v4 + Superforms server & client validation",
          icon: "CiDocumentCheck",
          href: "/forms",
        },
      ],
    },
    {
      id: "settings",
      label: "nav-settings",
      icon: "CiSettings",
      href: "/settings",
    },
    {
      id: "auth",
      label: "nav-auth",
      icon: "CiLock",
      children: [
        { id: "sign-in", label: "nav-sign-in", icon: "CiUser", href: "/auth/sign-in" },
        { id: "sign-up", label: "nav-sign-up", icon: "CiPlus", href: "/auth/sign-up" },
        { id: "forgot-pw", label: "nav-forgot-password", icon: "CiKey", href: "/auth/forgot-password" },
      ],
    },
  ];

  function handleLocaleChange(code: string) {
    const dir = starterI18n.setLocale(code);
    theme.setDirection(dir);
  }
</script>

{#if isAuthRoute}
  {@render children?.()}
{:else}
  <CoimAppShell
    items={navItems}
    {currentPath}
    locales={SUPPORTED_LOCALES.map((l) => ({ code: l.code, label: l.label, shortCode: l.shortCode }))}
    locale={starterI18n.locale}
    onLocaleChange={handleLocaleChange}
    translate={starterI18n.t}
    showVersionSelect={false}
    ctaHref="/forms"
    onNavigate={(href) => {
      void goto(href);
    }}
    footerLinks={[
      { label: "Dashboard", href: "/" },
      { label: "Projects", href: "/projects" },
      { label: "Forms", href: "/forms" },
      { label: "Settings", href: "/settings" },
    ]}
  >
    {@render children?.()}
  </CoimAppShell>
{/if}
