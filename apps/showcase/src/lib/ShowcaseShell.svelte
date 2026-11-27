<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { untrack, type Snippet } from "svelte";
  import {
    COIMUI_VERSION,
    CoimAppShell,
    getThemeContext,
    type CoimNotificationItem,
    type CoimShortcutItem,
    type CoimUserMenuLink,
    type CoimVersionOption,
  } from "@coimui/svelte";
  import { SHOWCASE_LOCALES, showcaseI18n } from "./i18n.svelte.ts";
  import { showcaseBottomNavItems, showcaseNavItems } from "./navigation.ts";
  import { showcaseSearchItems } from "./search-index.ts";

  interface Props {
    children?: Snippet;
  }

  let { children }: Props = $props();
  const theme = getThemeContext();

  const currentPath = $derived(page.url.pathname);
  const isStandaloneAuth = $derived(currentPath.startsWith("/pages/auth"));

  const versions: CoimVersionOption[] = [
    { label: `CoimUI v${COIMUI_VERSION}`, href: "/" },
    { label: "Component API", href: "/components" },
    { label: "Documentation", href: "/docs" },
  ];

  const shortcuts: CoimShortcutItem[] = [
    { id: "sc-1", label: "Data Grid", description: "Interactive table & XLSX export", href: "/data-grid", icon: "CiCellsPlus", bgClass: "bg-primary-light/10", colorClass: "text-primary" },
    { id: "sc-2", label: "Charts Gallery", description: "Bar, Line, Area, Funnel & Radar", href: "/charts", icon: "CiChartBar", bgClass: "bg-secondary-light/10", colorClass: "text-secondary" },
    { id: "sc-3", label: "Date Pickers", description: "ISO calendar & range presets", href: "/date-pickers", icon: "CiCalendarClock", bgClass: "bg-accent-1-light/10", colorClass: "text-accent-1" },
    { id: "sc-4", label: "Kanban Board", description: "Reorderable sprint columns", href: "/apps/kanban", icon: "CiDragVertical", bgClass: "bg-accent-2-light/10", colorClass: "text-accent-2" },
    { id: "sc-5", label: "Forms & Zod 4", description: "Schema-validated forms", href: "/forms", icon: "CiDocumentCheck", bgClass: "bg-accent-3-light/10", colorClass: "text-accent-3" },
  ];

  const notifications: CoimNotificationItem[] = [
    {
      id: "n-1",
      labelBold: "Laura Ellis",
      labelRegular: "updated the Data Grid showcase examples.",
      type: "user",
      time: "2 minutes ago",
      href: "/data-grid",
      avatarImage: "/images/avatars/avatar-1.jpg",
      temporaryUnread: true,
      markedUnread: false,
      chips: [{ id: "c-1", label: "coimui-accounts.xlsx" }],
    },
    {
      id: "n-2",
      labelBold: "Travis Howard",
      labelRegular: "requested reviewer access for SaaS Metrics.",
      type: "user",
      time: "18 minutes ago",
      avatarImage: "/images/avatars/avatar-2.jpg",
      temporaryUnread: true,
      markedUnread: false,
      actions: [
        { id: "act-1", label: "Approve", type: "positive" },
        { id: "act-2", label: "Decline", type: "negative" },
      ],
    },
    {
      id: "n-3",
      labelBold: `CoimUI v${COIMUI_VERSION}`,
      labelRegular: "Explore 185 Svelte 5 components, 469 icons, and Data Grid i18n.",
      type: "system",
      time: "1 hour ago",
      href: "/docs",
      avatarIcon: "CiSparkle",
      avatarColorBackground: "bg-primary-light/10",
      avatarColorMain: "text-primary",
      temporaryUnread: false,
      markedUnread: false,
    },
  ];

  const userMenuLinks: CoimUserMenuLink[] = [
    { id: "overview", label: "user-overview", href: "/", icon: "CiHome" },
    { id: "profile", label: "user-profile", href: "/pages/profile", icon: "CiUser" },
    { id: "pricing", label: "user-pricing", href: "/pages/pricing", icon: "CiDollarSquare" },
  ];

  const userSecondaryLinks: CoimUserMenuLink[] = [
    { id: "docs", label: "user-documentation", href: "/docs", icon: "CiDocumentFull" },
    { id: "faq", label: "user-help", href: "/pages/faq", icon: "CiQuestionHexagon" },
  ];

  let hydratedLocale = false;
  $effect(() => {
    if (hydratedLocale) return;
    hydratedLocale = true;
    untrack(() => {
      const dir = showcaseI18n.hydrateFromStorage();
      theme.setDirection(dir);
    });
  });

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
    {versions}
    searchItems={showcaseSearchItems}
    {shortcuts}
    {notifications}
    {userMenuLinks}
    {userSecondaryLinks}
    signOutHref="/pages/auth/sign-in"
    purchaseHref="/pages/pricing"
    notificationSettingsHref="/docs"
    locales={SHOWCASE_LOCALES.map((l) => ({
      code: l.code,
      label: l.label,
      flagSrc: `/images/flags/${l.code}.jpg`,
    }))}
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
