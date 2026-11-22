<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import type { Snippet } from "svelte";
  import {
    CoimAppShell,
    getThemeContext,
    type CoimNavItem,
    type CoimNotificationItem,
    type CoimSearchItem,
    type CoimShortcutItem,
    type CoimUserMenuLink,
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

  const searchItems: CoimSearchItem[] = [
    { id: "st-1", title: "Starter Dashboard", subtitle: "KPIs and workspace activity", href: "/", category: "products", avatarSrc: "/images/products/product-1.jpg", status: "active" },
    { id: "st-2", title: "Projects", subtitle: "Filterable project directory", href: "/projects", category: "products", avatarSrc: "/images/products/product-2.jpg", status: "active" },
    { id: "st-3", title: "Validated Forms", subtitle: "Zod v4 + Superforms schema", href: "/forms", category: "categories", icon: "CiDocumentCheck", iconBgClass: "bg-primary-light/10", iconColorClass: "text-primary" },
    { id: "st-4", title: "Workspace Settings", subtitle: "Theme, notifications & metadata", href: "/settings", category: "categories", icon: "CiSettings", iconBgClass: "bg-secondary-light/10", iconColorClass: "text-secondary" },
    { id: "st-5", title: "Laura Ellis", subtitle: "laura.ellis@coimui.dev", href: "/settings", category: "users", avatarSrc: "/images/avatars/avatar-3.jpg" },
  ];

  const shortcuts: CoimShortcutItem[] = [
    { id: "ssc-1", label: "Dashboard", description: "Workspace KPI overview", href: "/", icon: "CiHome", bgClass: "bg-primary-light/10", colorClass: "text-primary" },
    { id: "ssc-2", label: "Projects", description: "Create & filter records", href: "/projects", icon: "CiFolder", bgClass: "bg-secondary-light/10", colorClass: "text-secondary" },
    { id: "ssc-3", label: "Forms", description: "Zod 4 onboarding form", href: "/forms", icon: "CiPenSquare", bgClass: "bg-accent-1-light/10", colorClass: "text-accent-1" },
    { id: "ssc-4", label: "Settings", description: "Palette, mode & alerts", href: "/settings", icon: "CiSettings", bgClass: "bg-accent-2-light/10", colorClass: "text-accent-2" },
  ];

  const notifications: CoimNotificationItem[] = [
    {
      id: "sn-1",
      labelBold: "Daniel Miller",
      labelRegular: "moved Partner Onboarding to 91% completion.",
      type: "user",
      time: "10 minutes ago",
      href: "/projects",
      avatarImage: "/images/avatars/avatar-2.jpg",
      temporaryUnread: true,
      markedUnread: false,
    },
    {
      id: "sn-2",
      labelBold: "System",
      labelRegular: "Lean core bundle checks passed cleanly.",
      type: "system",
      time: "1 hour ago",
      href: "/settings",
      avatarIcon: "CiCheckSquare",
      avatarColorBackground: "bg-success-light/10",
      avatarColorMain: "text-success",
      temporaryUnread: false,
      markedUnread: false,
    },
  ];

  const userMenuLinks: CoimUserMenuLink[] = [
    { id: "overview", label: "user-overview", href: "/", icon: "CiHome" },
    { id: "projects", label: "user-projects", href: "/projects", icon: "CiFolder" },
    { id: "forms", label: "user-forms", href: "/forms", icon: "CiPenSquare" },
  ];

  const userSecondaryLinks: CoimUserMenuLink[] = [
    { id: "settings", label: "user-settings", href: "/settings", icon: "CiSettings" },
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
    {searchItems}
    {shortcuts}
    {notifications}
    {userMenuLinks}
    {userSecondaryLinks}
    signOutHref="/auth/sign-in"
    notificationSettingsHref="/settings"
    showPurchaseLink={false}
    locales={SUPPORTED_LOCALES.map((l) => ({
      code: l.code,
      label: l.label,
      flagSrc: `/images/flags/${l.code}.jpg`,
    }))}
    locale={starterI18n.locale}
    onLocaleChange={handleLocaleChange}
    translate={starterI18n.t}
    showVersionSelect={false}
    ctaHref="/settings"
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
