<script lang="ts">
  import type { Snippet } from "svelte";
  import CiListSquare from "../icons/ui/CiListSquare.svelte";
  import CiMenuSplit from "../icons/ui/CiMenuSplit.svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import { MenuShowState } from "../theme/types.js";
  import { cn } from "../utilities/utils.js";
  import { getLayoutContext } from "./layout-state.svelte.js";
  import CoimLogo from "./CoimLogo.svelte";
  import CoimModeToggle from "./CoimModeToggle.svelte";
  import CoimNotificationsMenu from "./CoimNotificationsMenu.svelte";
  import CoimSearchDialog from "./CoimSearchDialog.svelte";
  import CoimShortcutsMenu from "./CoimShortcutsMenu.svelte";
  import CoimUserMenu from "./CoimUserMenu.svelte";
  import CoimVersionSelect from "./CoimVersionSelect.svelte";
  import type {
    CoimLocaleOption,
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
    homeHref?: string;
    versions?: CoimVersionOption[];
    searchItems?: CoimSearchItem[];
    shortcuts?: CoimShortcutItem[];
    notifications?: CoimNotificationItem[];
    user?: CoimUserProfile;
    accounts?: CoimUserAccount[];
    userMenuLinks?: CoimUserMenuLink[];
    userSecondaryLinks?: CoimUserMenuLink[];
    signOutHref?: string;
    notificationSettingsHref?: string;
    notificationViewAllHref?: string;
    advancedSearchHref?: string;
    locales?: CoimLocaleOption[];
    locale?: string;
    onLocaleChange?: (code: string) => void;
    onAccountSwitch?: (account: CoimUserAccount) => void;
    onNotificationAction?: (item: CoimNotificationItem, action: CoimNotificationAction) => void;
    onSelectVersion?: (version: CoimVersionOption) => void;
    onNavigate?: NavigateFn;
    translate?: TranslateFn;
    showSearch?: boolean;
    showShortcuts?: boolean;
    showNotifications?: boolean;
    showVersionSelect?: boolean;
    rightActionsExtra?: Snippet;
  }

  let {
    homeHref = "/",
    versions,
    searchItems,
    shortcuts,
    notifications,
    user,
    accounts,
    userMenuLinks,
    userSecondaryLinks,
    signOutHref,
    notificationSettingsHref,
    notificationViewAllHref,
    advancedSearchHref,
    locales,
    locale = "en",
    onLocaleChange,
    onAccountSwitch,
    onNotificationAction,
    onSelectVersion,
    onNavigate,
    translate = (k) => k,
    showSearch = true,
    showShortcuts = true,
    showNotifications = true,
    showVersionSelect = true,
    rightActionsExtra,
  }: Props = $props();

  const theme = getThemeContext();
  const layout = getLayoutContext();

  let rightButtonsVisibleMobile = $state(false);

  function handleLogoClick(event: MouseEvent) {
    if (!onNavigate) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(homeHref);
  }
  function handleVersionSelect(label: string) {
    const matched = versions?.find((v) => v.label === label);
    if (matched) {
      onSelectVersion?.(matched);
      if (matched.href) {
        onNavigate?.(matched.href);
      }
    } else {
      onSelectVersion?.({ label });
    }
  }
</script>

<header class={cn("sticky top-0 h-16 w-full", theme.isTopNavContained && !layout.showLeftMobileButton ? "z-5" : "z-20")}>
  <div
    class={cn(
      "flex h-full w-full flex-none flex-row items-center",
      theme.isTopNavContained
        ? "shadow-grey-100 rounded-b-3xl bg-transparent shadow-[0_1px_0_0] backdrop-blur-xl"
        : "shadow-darker-xs bg-background-paper rounded-b-3xl",
    )}
    style:padding="0 var(--main-padding)"
  >
    {#if !theme.isTopNavContained}
      <div
        aria-hidden="true"
        class={cn(
          "bg-background absolute inset-0 -z-20 rounded-b-3xl",
          layout.leftPrimaryCurrent !== MenuShowState.Hide && "rounded-br-none! rtl:rounded-bl-none!",
          layout.showLeftMobileButton && "bg-background rounded-none",
        )}
      ></div>
      <div
        aria-hidden="true"
        class={cn(
          "bg-background-paper absolute inset-0 -z-10 rounded-b-3xl",
          layout.leftPrimaryCurrent !== MenuShowState.Hide && "rounded-bl-none! rtl:rounded-br-none!",
          layout.showLeftMobileButton && "bg-background rounded-none",
        )}
      ></div>
    {/if}

    <!-- Left menu mobile toggle -->
    <button
      type="button"
      aria-label="Toggle navigation menu"
      aria-expanded={layout.leftPrimaryCurrent !== MenuShowState.Hide}
      onclick={() => (layout.leftShowBackdrop ? layout.hideLeft() : layout.showLeftInMobile())}
      class={cn(
        "icon-only hover-icon-shrink text-text-primary hover:bg-grey-25 h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-all",
        layout.showLeftMobileButton ? "flex" : "hidden",
        layout.leftPrimaryCurrent !== MenuShowState.Hide && "active text-primary bg-grey-25",
      )}
    >
      <CiMenuSplit size={24} class="transition-transform" />
    </button>

    <div class="flex h-full flex-1 flex-row items-center gap-4 md:gap-6">
      {#if !theme.isTopNavContained}
        <a href={homeHref} onclick={handleLogoClick} class="inline-flex items-center no-underline">
          <CoimLogo classNameFull="ms-2 hidden md:block" classNameMobile="ms-2 md:hidden" />
        </a>
      {/if}

      {#if showVersionSelect}
        <div class={cn(rightButtonsVisibleMobile ? "hidden sm:block" : "block")}>
          <CoimVersionSelect {versions} onSelectVersion={handleVersionSelect} {onNavigate} />
        </div>
      {/if}
    </div>

    <!-- Right buttons -->
    <div class="flex flex-row items-center sm:gap-1">
      <div class={cn("flex-row items-center sm:flex! sm:gap-1", rightButtonsVisibleMobile ? "flex" : "hidden")}>
        {#if showSearch}
          <CoimSearchDialog items={searchItems} {advancedSearchHref} {onNavigate} />
        {/if}
        {#if showShortcuts}
          <CoimShortcutsMenu {shortcuts} {onNavigate} />
        {/if}
        {#if showNotifications}
          <CoimNotificationsMenu
            {notifications}
            settingsHref={notificationSettingsHref}
            viewAllHref={notificationViewAllHref}
            onAction={onNotificationAction}
            {onNavigate}
          />
        {/if}
        <CoimModeToggle />
        {@render rightActionsExtra?.()}
      </div>

      <button
        type="button"
        aria-label="Toggle header actions"
        aria-expanded={rightButtonsVisibleMobile}
        onclick={() => (rightButtonsVisibleMobile = !rightButtonsVisibleMobile)}
        class={cn(
          "icon-only hover-icon-shrink text-text-primary hover:bg-grey-25 ms-1 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-all sm:hidden",
          rightButtonsVisibleMobile && "active text-primary",
        )}
      >
        <CiListSquare size="large" />
      </button>
    </div>

    <CoimUserMenu
      {user}
      {accounts}
      links={userMenuLinks}
      secondaryLinks={userSecondaryLinks}
      {signOutHref}
      {locales}
      {locale}
      {onLocaleChange}
      {onAccountSwitch}
      {onNavigate}
      {translate}
    />
  </div>
</header>
