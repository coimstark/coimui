<script lang="ts">
  import { onMount, untrack, type Snippet } from "svelte";
  import { Tooltip } from "bits-ui";
  import { ThemeState, setThemeContext, tryGetThemeContext } from "../theme/theme-state.svelte.js";
  import { COIM_SCREENS } from "../utilities/screen.svelte.js";
  import { LayoutState, setLayoutContext } from "./layout-state.svelte.js";
  import CoimBackgroundWrapper from "./CoimBackgroundWrapper.svelte";
  import CoimHeader from "./CoimHeader.svelte";
  import CoimLeftMenu from "./CoimLeftMenu.svelte";
  import CoimMain from "./CoimMain.svelte";
  import CoimMenuBackdrop from "./CoimMenuBackdrop.svelte";
  import CoimThemeConfiguration from "./CoimThemeConfiguration.svelte";
  import type {
    CoimFooterLink,
    CoimLocaleOption,
    CoimNavItem,
    CoimNotificationAction,
    CoimNotificationItem,
    CoimSearchItem,
    CoimShortcutItem,
    CoimUserAccount,
    CoimUserMenuLink,
    CoimUserProfile,
    CoimVersionOption,
    NavigateFn,
    TranslateFn,
  } from "./types.js";

  interface Props {
    items: CoimNavItem[];
    bottomItems?: CoimNavItem[];
    currentPath: string;
    homeHref?: string;
    ctaHref?: string;
    purchaseHref?: string;
    showPurchaseLink?: boolean;
    versions?: CoimVersionOption[];
    searchItems?: CoimSearchItem[];
    advancedSearchHref?: string;
    shortcuts?: CoimShortcutItem[];
    notifications?: CoimNotificationItem[];
    notificationSettingsHref?: string;
    notificationViewAllHref?: string;
    user?: CoimUserProfile;
    accounts?: CoimUserAccount[];
    userMenuLinks?: CoimUserMenuLink[];
    userSecondaryLinks?: CoimUserMenuLink[];
    signOutHref?: string;
    locales?: CoimLocaleOption[];
    locale?: string;
    onLocaleChange?: (code: string) => void;
    onAccountSwitch?: (account: CoimUserAccount) => void;
    onNotificationAction?: (item: CoimNotificationItem, action: CoimNotificationAction) => void;
    onSelectVersion?: (version: CoimVersionOption) => void;
    onNavigate?: NavigateFn;
    translate?: TranslateFn;
    menuStorageKey?: string;
    persistMenu?: boolean;
    footerLinks?: CoimFooterLink[];
    disableContentWrapper?: boolean;
    showSearch?: boolean;
    showShortcuts?: boolean;
    showNotifications?: boolean;
    showVersionSelect?: boolean;
    rightActionsExtra?: Snippet;
    ctaSlot?: Snippet;
    children?: Snippet;
  }

  let {
    items,
    bottomItems = [],
    currentPath,
    homeHref = "/",
    ctaHref = "/docs",
    purchaseHref = "/pages/pricing",
    showPurchaseLink = true,
    versions,
    searchItems,
    advancedSearchHref,
    shortcuts,
    notifications,
    notificationSettingsHref,
    notificationViewAllHref,
    user,
    accounts,
    userMenuLinks,
    userSecondaryLinks,
    signOutHref,
    locales,
    locale = "en",
    onLocaleChange,
    onAccountSwitch,
    onNotificationAction,
    onSelectVersion,
    onNavigate,
    translate = (k) => k,
    menuStorageKey,
    persistMenu,
    footerLinks,
    disableContentWrapper = false,
    showSearch = true,
    showShortcuts = true,
    showNotifications = true,
    showVersionSelect = true,
    rightActionsExtra,
    ctaSlot,
    children,
  }: Props = $props();

  const existingTheme = tryGetThemeContext();
  const theme = existingTheme ?? setThemeContext(untrack(() => new ThemeState()));

  const layoutState = setLayoutContext(
    untrack(
      () =>
        new LayoutState({
          storageKey: menuStorageKey ?? theme.storageKeys.leftMenuType,
          defaultMenuType: theme.defaults.leftMenuType,
          menuDefaultWidth: theme.defaults.leftMenuWidth,
          persist: persistMenu ?? theme.persist,
        }),
    ),
  );

  onMount(() => {
    if (!existingTheme) {
      theme.hydrateFromBrowser();
      theme.syncDocumentClasses();
    }

    layoutState.hydrateFromBrowser();

    const hasMatchMedia =
      typeof window !== "undefined" && typeof window.matchMedia === "function";

    const primaryBp = COIM_SCREENS[theme.defaults.menuPrimaryBreakpoint];
    const secondaryBp = COIM_SCREENS[theme.defaults.menuSecondaryBreakpoint];

    const primaryMql = hasMatchMedia ? window.matchMedia(`(min-width: ${primaryBp})`) : null;
    const secondaryMql = hasMatchMedia ? window.matchMedia(`(min-width: ${secondaryBp})`) : null;

    const initialPrimaryMatch = primaryMql ? primaryMql.matches : true;
    const initialSecondaryMatch = secondaryMql ? secondaryMql.matches : true;

    layoutState.setPrimaryBreakpointMatch(initialPrimaryMatch);
    layoutState.setSecondaryBreakpointMatch(initialSecondaryMatch);
    if (!existingTheme) {
      theme.isMobile = !initialPrimaryMatch;
    }

    const onPrimaryChange = (event: MediaQueryListEvent) => {
      layoutState.setPrimaryBreakpointMatch(event.matches);
      if (!existingTheme) {
        theme.isMobile = !event.matches;
      }
    };

    const onSecondaryChange = (event: MediaQueryListEvent) => {
      layoutState.setSecondaryBreakpointMatch(event.matches);
    };

    primaryMql?.addEventListener("change", onPrimaryChange);
    secondaryMql?.addEventListener("change", onSecondaryChange);

    return () => {
      primaryMql?.removeEventListener("change", onPrimaryChange);
      secondaryMql?.removeEventListener("change", onSecondaryChange);
    };
  });

  $effect(() => {
    if (!existingTheme) {
      void theme.theme;
      void theme.resolvedMode;
      void theme.elevation;
      void theme.direction;
      theme.syncDocumentClasses();
    }
  });

  $effect(() => {
    void currentPath;
    if (typeof window !== "undefined" && typeof window.scrollTo === "function") {
      window.scrollTo(0, 0);
    }
  });

  const skipLabel = $derived.by(() => {
    const translated = translate("skip-to-content");
    return translated === "skip-to-content" ? "Skip to content" : translated;
  });
</script>

{#snippet headerBar()}
  <CoimHeader
    {homeHref}
    {versions}
    {searchItems}
    {advancedSearchHref}
    {shortcuts}
    {notifications}
    {notificationSettingsHref}
    {notificationViewAllHref}
    {user}
    {accounts}
    {userMenuLinks}
    {userSecondaryLinks}
    {signOutHref}
    {locales}
    {locale}
    {onLocaleChange}
    {onAccountSwitch}
    {onNotificationAction}
    {onSelectVersion}
    {onNavigate}
    {translate}
    {showSearch}
    {showShortcuts}
    {showNotifications}
    {showVersionSelect}
    {rightActionsExtra}
  />
{/snippet}

<Tooltip.Provider delayDuration={150}>
  <a
    href="#coim-main-content"
    class="coim-visually-hidden focus:bg-background-paper focus:text-primary focus:shadow-darker-sm focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
  >
    {skipLabel}
  </a>

  <CoimBackgroundWrapper />

  {#if !theme.isTopNavContained}
    {@render headerBar()}
  {/if}

  <CoimLeftMenu
    {items}
    {bottomItems}
    {currentPath}
    {homeHref}
    {ctaHref}
    {onNavigate}
    {translate}
    {ctaSlot}
  />

  <CoimMain {items} {bottomItems} {currentPath} {footerLinks} {disableContentWrapper} {onNavigate} {translate}>
    {#snippet headerSlot()}
      {#if theme.isTopNavContained}
        {@render headerBar()}
      {/if}
    {/snippet}
    {@render children?.()}
  </CoimMain>

  <CoimThemeConfiguration {translate} {purchaseHref} {showPurchaseLink} {onNavigate} />
  <CoimMenuBackdrop />
</Tooltip.Provider>
