<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    COIMUI_VERSION,
    CoimAuthLayout,
    CoimBreadcrumbs,
    CoimButton,
    CoimChip,
    CoimContentWrapper,
    CoimFooter,
    CoimLogo,
    CoimModeToggle,
    CoimNotificationsMenu,
    CoimPaper,
    CoimPrimaryItem,
    CoimSearchDialog,
    CoimSecondaryItem,
    CoimShortcutsMenu,
    CoimStack,
    CoimTitleWrapper,
    CoimTooltipProvider,
    CoimTypography,
    CoimUserMenu,
    CoimVersionSelect,
    MenuType,
    type CoimNavItem,
    type OpenedAccordion,
    toast,
  } from "@coimui/svelte";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import type { ComponentApiGroup } from "#lib/components/doc-types.ts";

  const END_SCRIPT = "</" + "script>";

  const sampleNavItems: CoimNavItem[] = [
    {
      id: "demo-overview",
      label: "Overview",
      icon: "CiHome",
      href: "/components/layouts",
      children: [
        { id: "demo-shell", label: "App Shell", href: "/components/layouts#coim-app-shell" },
        { id: "demo-auth", label: "Auth Layout", href: "/components/layouts#coim-auth-layout" },
      ],
    },
    { id: "demo-docs", label: "Documentation", icon: "CiBook", href: "/docs" },
  ];

  let selectedPrimary = $state(sampleNavItems[0]);
  let openedAccordions = $state<OpenedAccordion[]>([]);
  let showBrandFooter = $state(true);

  const appShellCode = $derived(`<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { CoimAppShell, type CoimNavItem } from "@coimui/svelte";

  let { children } = $props();
  const items: CoimNavItem[] = [{ id: "home", label: "Home", icon: "CiHome", href: "/" }];
${END_SCRIPT}

<CoimAppShell
  {items}
  currentPath={page.url.pathname}
  brandText="Acme Admin"
  showFooter={${showBrandFooter}}
  onNavigate={(href) => void goto(href)}
>
  {@render children?.()}
</CoimAppShell>`);

  const appShellApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimAppShell",
      props: [
        { name: "items", type: "CoimNavItem[]", description: "Primary and nested navigation items." },
        { name: "bottomItems", type: "CoimNavItem[]", defaultValue: "[]", description: "Optional utility links pinned to bottom of the sidebar rail." },
        { name: "currentPath", type: "string", description: "Current pathname used for active state & breadcrumb syncing." },
        { name: "versions / searchItems / shortcuts / notifications", type: "Arrays", description: "Data feeds wired straight into the header widgets." },
        { name: "user / accounts / userMenuLinks", type: "User types", description: "Profile, account switcher, and quick account actions." },
        { name: "locales / locale / onLocaleChange", type: "i18n props", description: "Locale picker options and change callback." },
        { name: "translate", type: "(key: string) => string", description: "Translates menu labels, chrome actions, and search strings." },
        { name: "onNavigate", type: "(href: string) => void", kind: "event", description: "Router hook (typically (href) => void goto(href))." },
      ],
    },
    {
      title: "Structural Building Blocks (Header, LeftMenu, Main, Wrappers, Footer)",
      props: [
        { name: "CoimHeader / CoimLeftMenu / CoimMain", type: "Layout regions", description: "Compose CoimAppShell internals or build a custom workspace frame." },
        { name: "CoimBackgroundWrapper / CoimMenuBackdrop", type: "Canvas & Backdrop", description: "Themed background layer and temporary mobile drawer scrim." },
        { name: "CoimContentWrapper / CoimTitleWrapper", type: "Layout slots", description: "Centered/fluid page content and title alignment wrappers." },
        { name: "CoimPrimaryItem / CoimSecondaryItem", type: "Nav items", description: "Individual primary rail buttons and nested accordion links." },
        { name: "CoimFooter", type: "links?, translate?, onNavigate?", description: "Footer bar rendered below main view content." },
        { name: "CoimThemeConfiguration", type: "translate?, purchaseHref?", description: "Slide-out live theme/layout customizer drawer." },
      ],
    },
  ];

  const authLayoutCode = `<script lang="ts">
  import { CoimAuthLayout, CoimTypography, CoimTextField, CoimButton } from "@coimui/svelte";
${END_SCRIPT}

<CoimAuthLayout currentPath="/pages/auth/sign-in">
  <CoimTypography variant="h2">Sign In</CoimTypography>
  <CoimTextField label="Email" fullWidth />
  <CoimButton variant="contained" fullWidth>Continue</CoimButton>
</CoimAuthLayout>`;

  const authLayoutProps = [
    { name: "currentPath", type: "string", defaultValue: "\"\"", description: "Optional current route path for active auth link state." },
    { name: "class", type: "string", defaultValue: "\"\"", description: "Extra container classes applied to the auth card wrapper." },
    { name: "children", type: "Snippet", kind: "snippet" as const, description: "Authentication form and heading content." },
  ];

  const headerControlsCode = `<script lang="ts">
  import {
    CoimLogo,
    CoimVersionSelect,
    CoimSearchDialog,
    CoimShortcutsMenu,
    CoimNotificationsMenu,
    CoimModeToggle,
    CoimUserMenu,
  } from "@coimui/svelte";
${END_SCRIPT}

<div class="flex items-center gap-2">
  <CoimLogo brandText="Acme" />
  <CoimVersionSelect versions={[{ label: "v${COIMUI_VERSION}", href: "/docs" }]} />
  <CoimSearchDialog />
  <CoimShortcutsMenu />
  <CoimNotificationsMenu />
  <CoimModeToggle />
  <CoimUserMenu />
</div>`;

  const headerControlsApiGroups: ComponentApiGroup[] = [
    {
      title: "CoimLogo & CoimModeToggle & CoimVersionSelect",
      props: [
        { name: "CoimLogo", type: "{ brandText?, classNameFull?, classNameMobile? }", description: "Responsive brand mark that adapts to compact and wide sidebar widths." },
        { name: "CoimModeToggle", type: "{ class? }", description: "One-click Light / Dark mode toggle synced with ThemeState." },
        { name: "CoimVersionSelect", type: "{ versions?, selectedVersion?, onSelectVersion?, onNavigate? }", description: "Header dropdown for app releases or workspace switching." },
      ],
    },
    {
      title: "CoimSearchDialog & Menus (Notifications, Shortcuts, User)",
      props: [
        { name: "CoimSearchDialog", type: "{ items?, advancedSearchHref?, onNavigate?, translate? }", description: "Cmd/Ctrl+K command palette with category tabs and instant filtering." },
        { name: "CoimNotificationsMenu", type: "{ notifications?, settingsHref?, viewAllHref?, onAction?, onNavigate? }", description: "Popover inbox with unread badges, chips, and inline action buttons." },
        { name: "CoimShortcutsMenu", type: "{ shortcuts?, onAddShortcut?, onNavigate? }", description: "Quick-launch shortcut grid popover in header bar." },
        { name: "CoimUserMenu", type: "{ user?, accounts?, activeAccountId?, links?, locales?, locale?, onLocaleChange?, onAccountSwitch? }", description: "Account switcher, theme/mode picker, locale picker, and sign-out menu." },
      ],
    },
  ];
</script>

<svelte:head><title>CoimUI Showcase — Layouts &amp; App Shell</title></svelte:head>

<CoimStack spacing={5}>
  <div>
    <CoimBreadcrumbs
      items={[
        { label: "Home", href: "/" },
        { label: "UI Components", href: "/components" },
        { label: "Layouts & App Shell" },
      ]}
    />
    <CoimTypography variant="h1" class="mt-2">Layouts &amp; App Shell</CoimTypography>
    <p class="text-text-secondary mt-1">
      Application chrome, responsive dual sidebar primitives, auth containers, and topbar controls. Note: <code>CoimHeader</code>, <code>CoimLeftMenu</code>, <code>CoimMain</code>, <code>CoimBackgroundWrapper</code>, <code>CoimMenuBackdrop</code>, and <code>CoimThemeConfiguration</code> are orchestrated directly inside <code>CoimAppShell</code>.
    </p>
  </div>

  <ComponentDocCard
    id="coim-app-shell"
    title="CoimAppShell &amp; Navigation Item Primitives"
    description="Composable shell assembling CoimBackgroundWrapper, CoimHeader, CoimLeftMenu, CoimMenuBackdrop, CoimMain, CoimContentWrapper, CoimTitleWrapper, CoimPrimaryItem, CoimSecondaryItem, CoimFooter, and CoimThemeConfiguration."
    code={appShellCode}
    apiGroups={appShellApiGroups}
  >
    <CoimStack spacing={3}>
      <CoimTitleWrapper>
        <div class="flex flex-wrap items-center justify-between gap-2">
          <CoimChip label={`Selected rail item: ${selectedPrimary.label}`} size="small" color="primary" variant="pastel" />
          <CoimButton size="small" variant="outlined" onclick={() => (showBrandFooter = !showBrandFooter)}>
            Footer: {showBrandFooter ? "Shown" : "Hidden"}
          </CoimButton>
        </div>
      </CoimTitleWrapper>

      <CoimContentWrapper>
        <div class="border-grey-100 grid gap-3 rounded-lg border p-3 md:grid-cols-2">
          <CoimPaper class="p-3" variant="outlined">
            <span class="text-text-secondary mb-2 block text-xs font-semibold">CoimPrimaryItem Preview</span>
            <div class="flex flex-col gap-1">
              {#each sampleNavItems as nav (nav.id)}
                <CoimPrimaryItem
                  item={nav}
                  currentPath="/components/layouts"
                  isActive={selectedPrimary.id === nav.id}
                  menuType={MenuType.SingleLayer}
                  onSelect={(item) => {
                    selectedPrimary = item;
                    toast.info(`Selected primary item: ${item.label}`);
                  }}
                />
              {/each}
            </div>
          </CoimPaper>

          <CoimPaper class="p-3" variant="outlined">
            <span class="text-text-secondary mb-2 block text-xs font-semibold">CoimSecondaryItem Preview</span>
            <div class="flex flex-col gap-1">
              {#each sampleNavItems[0].children ?? [] as child (child.id)}
                <CoimSecondaryItem
                  item={child}
                  currentPath="/components/layouts"
                  {openedAccordions}
                  onToggleAccordion={(next) => (openedAccordions = next)}
                  onNavigate={(href) => void goto(href)}
                />
              {/each}
            </div>
          </CoimPaper>
        </div>
      </CoimContentWrapper>

      {#if showBrandFooter}
        <CoimFooter
          links={[
            { label: "Docs", href: "/docs" },
            { label: "Components", href: "/components" },
            { label: "Utilities", href: "/components/utilities" },
          ]}
          onNavigate={(href) => void goto(href)}
        />
      {/if}
    </CoimStack>
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-header-controls"
    title="Topbar Controls &amp; Command Palette"
    description="Standalone header controls powered by Bits UI popovers, dialogs, and ThemeState."
    code={headerControlsCode}
    apiGroups={headerControlsApiGroups}
  >
    <CoimTooltipProvider>
      <div class="border-grey-100 bg-background flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
        <div class="flex flex-wrap items-center gap-3">
          <CoimLogo brandText="CoimUI" />
          <CoimVersionSelect
            versions={[
              { label: `v${COIMUI_VERSION} (Latest)`, href: "/docs/welcome/changelog" },
              { label: "Component API", href: "/components" },
            ]}
            onNavigate={(href) => void goto(href)}
          />
        </div>
        <div class="flex flex-wrap items-center gap-1.5">
          <CoimSearchDialog onNavigate={(href) => void goto(href)} />
          <CoimShortcutsMenu onNavigate={(href) => void goto(href)} />
          <CoimNotificationsMenu onNavigate={(href) => void goto(href)} />
          <CoimModeToggle />
          <CoimUserMenu onNavigate={(href) => void goto(href)} />
        </div>
      </div>
    </CoimTooltipProvider>
  </ComponentDocCard>

  <ComponentDocCard
    id="coim-auth-layout"
    title="CoimAuthLayout"
    description="Centered authentication card frame for sign-in, registration, and password recovery flows."
    code={authLayoutCode}
    propsDocs={authLayoutProps}
  >
    <div class="border-grey-100 max-h-80 overflow-hidden rounded-lg border">
      <CoimAuthLayout currentPath="/pages/auth/sign-in" class="min-h-64! py-6!">
        <CoimTypography variant="h4">Sign In Preview</CoimTypography>
        <p class="text-text-secondary mt-1 text-sm">
          Centered auth layout slot with automatic theme &amp; contrast styling.
        </p>
        <div class="mt-4">
          <CoimButton href="/pages/auth/sign-in" size="small" variant="contained">
            Open Full Auth Example
          </CoimButton>
        </div>
      </CoimAuthLayout>
    </div>
  </ComponentDocCard>
</CoimStack>
