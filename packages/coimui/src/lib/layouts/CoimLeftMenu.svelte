<script lang="ts">
  import { untrack, type Snippet } from "svelte";
  import IllustrationLaunch from "../icons/illustrations/IllustrationLaunch.svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import { MenuShowState, MenuType } from "../theme/types.js";
  import { cn, isPathMatch } from "../utilities/utils.js";
  import { getLayoutContext } from "./layout-state.svelte.js";
  import { findPrimaryNavItem, resolveLabel } from "./nav-utils.js";
  import CoimLogo from "./CoimLogo.svelte";
  import CoimPrimaryItem from "./CoimPrimaryItem.svelte";
  import CoimSecondaryItem from "./CoimSecondaryItem.svelte";
  import type { CoimNavItem, NavigateFn, OpenedAccordion, TranslateFn } from "./types.js";

  interface Props {
    items: CoimNavItem[];
    bottomItems?: CoimNavItem[];
    currentPath: string;
    homeHref?: string;
    ctaHref?: string;
    brandText?: string;
    logoSlot?: Snippet<[{ compact: boolean }]>;
    onNavigate?: NavigateFn;
    translate?: TranslateFn;
    ctaSlot?: Snippet;
  }

  let {
    items,
    bottomItems = [],
    currentPath,
    homeHref = "/",
    ctaHref = "/docs",
    brandText,
    logoSlot,
    onNavigate,
    translate = (k) => k,
    ctaSlot,
  }: Props = $props();

  const theme = getThemeContext();
  const layout = getLayoutContext();

  let selectedPrimary = $state<CoimNavItem | undefined>(undefined);
  let activeItem = $state<CoimNavItem | undefined>(undefined);
  let openedAccordions = $state<OpenedAccordion[]>([]);

  function findPrimaryForPath(path: string): CoimNavItem | undefined {
    return findPrimaryNavItem(items, bottomItems, path);
  }

  function findSelectedSecondary(menuItems: CoimNavItem[], path: string): CoimNavItem | undefined {
    for (const item of menuItems) {
      if (item.href && isPathMatch(path, item.href)) return item;
      if (item.children) {
        const found = findSelectedSecondary(item.children, path);
        if (found) return found;
      }
    }
    return undefined;
  }

  function updateSelectedSecondaryItem() {
    if (!activeItem?.children) {
      layout.setMenuSelectedSecondaryItem(undefined);
      return;
    }
    layout.setMenuSelectedSecondaryItem(findSelectedSecondary(activeItem.children, currentPath));
  }

  $effect(() => {
    const matched = findPrimaryForPath(currentPath);
    untrack(() => {
      selectedPrimary = matched;
      activeItem = matched;
      if (layout.temporaryShowPrimaryMenu) {
        layout.setTemporaryShowPrimaryMenu(false);
      }
      layout.resetLeftMenu();
    });
  });

  $effect(() => {
    return layout.onResetLeft(() => {
      if (selectedPrimary) {
        activeItem = selectedPrimary;
        const visibleChildren = (selectedPrimary.children ?? []).filter((x) => !x.hideInMenu);
        if (visibleChildren.length === 0) {
          layout.hideLeftSecondary();
        }
        updateSelectedSecondaryItem();
      }
    });
  });

  $effect(() => {
    void activeItem;
    void currentPath;
    updateSelectedSecondaryItem();
  });

  $effect(() => {
    if (selectedPrimary?.id !== activeItem?.id && !layout.leftShowBackdrop) {
      layout.setLeftShowBackdrop(true);
    }
  });

  $effect(() => {
    if (!activeItem) {
      if (layout.showLeftMobileButton) {
        layout.hideLeftSecondary();
      } else {
        layout.hideLeft();
      }
    }
  });

  $effect(() => {
    if (!activeItem?.children && layout.leftSecondaryCurrent === MenuShowState.Hide) {
      layout.hideLeftSecondary();
    }
  });

  function handleSelectPrimaryItem(item: CoimNavItem) {
    if (!layout.temporaryShowPrimaryMenu && layout.leftMenuType !== MenuType.SingleLayer) {
      layout.setTemporaryShowPrimaryMenu(true);
    }
    layout.setMenuSelectedSecondaryItem(undefined);
    const visibleChildren = (item.children ?? []).filter((x) => !x.hideInMenu);

    if (item.content || visibleChildren.length > 0) {
      layout.showLeftSecondary();
      activeItem = item;
    } else if (isPathMatch(currentPath, item.href || "")) {
      layout.hideLeftSecondary();
      layout.resetLeftMenu();
      activeItem = item;
    } else {
      openedAccordions = openedAccordions.filter((a) => a.indent !== 0);
      activeItem = item;
      if (item.href && onNavigate) {
        onNavigate(item.href);
      }
    }
  }

  function handleLinkClick(event: MouseEvent, href: string) {
    if (!onNavigate) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate(href);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && (layout.leftShowBackdrop || layout.temporaryShowPrimaryMenu)) {
      layout.setTemporaryShowPrimaryMenu(false);
      layout.resetLeftMenu();
    }
  }

  const leftSecondaryDefaultWidth = $derived(
    theme.defaults.leftMenuWidth[layout.leftMenuType].secondary,
  );
  const visiblePrimaryItems = $derived(items.filter((x) => !x.hideInMenu));
  const visibleBottomItems = $derived(bottomItems.filter((x) => !x.hideInMenu));
  const activeVisibleChildren = $derived(
    (activeItem?.children ?? []).filter((x) => !x.hideInMenu),
  );
  const customContentSnippet = $derived(
    activeItem?.content ?? layout.menuSelectedSecondaryItem?.content,
  );
</script>

<svelte:window onkeydown={handleKeydown} />

<nav
  aria-label="Primary navigation"
  class={cn(
    "bg-background fixed z-10",
    theme.isTopNavContained ? "h-full" : "h-[calc(100%-4rem)]",
  )}
>
  <div class="bg-background-paper shadow-darker-xs flex h-full w-full flex-row rounded-e-4xl">
    <div
      class="flex h-full shrink-0 grow-0 flex-col items-center overflow-x-hidden py-2.5! transition-all duration-(--layout-duration)"
      style:width={layout.leftPrimaryCurrent !== MenuShowState.Hide && layout.leftMenuWidth.primary > 0
        ? `${layout.leftMenuWidth.primary}px`
        : "0px"}
    >
      <div
        class={cn(
          layout.leftMenuType === MenuType.SingleLayer &&
            layout.leftPrimaryCurrent !== MenuShowState.Hide &&
            layout.leftMenuWidth.primary > 0 &&
            "overflow-y-scroll px-4 pt-2 pb-6",
          "absolute flex h-full min-h-full shrink-0 grow-0 flex-col items-center gap-0.5 overflow-y-auto",
          layout.leftMenuType === MenuType.Minimal &&
            layout.leftPrimaryCurrent !== MenuShowState.Hide &&
            layout.leftMenuWidth.primary > 0 &&
            "overflow-y-scroll ps-2",
          layout.leftMenuType === MenuType.Comfort &&
            layout.leftPrimaryCurrent !== MenuShowState.Hide &&
            layout.leftMenuWidth.primary > 0 &&
            "overflow-y-scroll ps-2.5",
        )}
        style:width={layout.leftPrimaryCurrent !== MenuShowState.Hide && layout.leftMenuWidth.primary > 0
          ? `${layout.leftMenuWidth.primary}px`
          : "0px"}
      >
        {#if theme.isTopNavContained && layout.leftMenuType === MenuType.SingleLayer}
          <a
            href={homeHref}
            onclick={(e) => handleLinkClick(e, homeHref)}
            class="flex h-16 w-full flex-none items-start justify-center pt-2 no-underline"
          >
            {#if logoSlot}
              {@render logoSlot({ compact: false })}
            {:else}
              <CoimLogo {brandText} classNameFull="flex" classNameMobile="hidden" />
            {/if}
          </a>
        {/if}

        {#if theme.isTopNavContained && layout.leftMenuType === MenuType.Minimal}
          <a
            href={homeHref}
            onclick={(e) => handleLinkClick(e, homeHref)}
            class="-ms-2 flex h-13 w-full flex-none items-start justify-center pt-2 no-underline"
          >
            {#if logoSlot}
              {@render logoSlot({ compact: true })}
            {:else}
              <CoimLogo {brandText} classNameFull="hidden" classNameMobile="h-6 w-6" />
            {/if}
          </a>
        {/if}

        {#if theme.isTopNavContained && layout.leftMenuType === MenuType.Comfort}
          <a
            href={homeHref}
            onclick={(e) => handleLinkClick(e, homeHref)}
            class="flex h-17.25 w-full flex-none items-center justify-center no-underline"
          >
            {#if logoSlot}
              {@render logoSlot({ compact: true })}
            {:else}
              <CoimLogo {brandText} classNameFull="hidden" classNameMobile="h-9 w-8" />
            {/if}
          </a>
        {/if}

        {#if !layout.temporaryShowPrimaryMenu && layout.leftMenuType === MenuType.SingleLayer && customContentSnippet}
          <div class="flex w-full flex-1 flex-col">
            {@render customContentSnippet()}
          </div>
        {:else if layout.leftMenuType === MenuType.SingleLayer}
          <div class="flex w-full flex-1 flex-col gap-1">
            {#each visiblePrimaryItems as item (item.id)}
              <CoimSecondaryItem
                class={cn(layout.leftShowBackdrop && "z-20")}
                {item}
                {currentPath}
                indent={0}
                {openedAccordions}
                onToggleAccordion={(next) => (openedAccordions = next)}
                {onNavigate}
                {translate}
                onSelect={(selected) => {
                  if (layout.temporaryShowPrimaryMenu) {
                    layout.setTemporaryShowPrimaryMenu(false);
                  }
                  handleSelectPrimaryItem(selected);
                  activeItem = selected;
                }}
              />
            {/each}
          </div>

          {#if ctaSlot}
            <div class="mt-auto mb-3 w-full">
              {@render ctaSlot()}
            </div>
          {/if}

          <div class="mb-5 flex w-full flex-col gap-0.5">
            {#each visibleBottomItems as item (item.id)}
              <CoimSecondaryItem
                class={cn(layout.leftShowBackdrop && "z-20")}
                {item}
                {currentPath}
                indent={0}
                {openedAccordions}
                onToggleAccordion={(next) => (openedAccordions = next)}
                {onNavigate}
                {translate}
                onSelect={handleSelectPrimaryItem}
              />
            {/each}
          </div>
        {:else}
          <div class="flex w-full flex-1 flex-col gap-0.5">
            {#each visiblePrimaryItems as item (item.id)}
              <CoimPrimaryItem
                class={cn(layout.leftShowBackdrop && "z-20")}
                {item}
                {currentPath}
                onSelect={handleSelectPrimaryItem}
                isActive={activeItem?.id === item.id}
                menuType={layout.leftMenuType}
                {translate}
              />
            {/each}
          </div>

          <div class="mb-5 flex w-full flex-col gap-0.5">
            {#each visibleBottomItems as item (item.id)}
              <CoimPrimaryItem
                class={cn(layout.leftShowBackdrop && "z-20")}
                {item}
                {currentPath}
                onSelect={handleSelectPrimaryItem}
                isActive={activeItem?.id === item.id}
                menuType={layout.leftMenuType}
                {translate}
              />
            {/each}
          </div>
        {/if}
      </div>
    </div>

    {#if layout.leftMenuType === MenuType.Comfort || layout.leftMenuType === MenuType.Minimal}
      <div
        class={cn(
          "ltr:shadow-line-left rtl:shadow-line-right flex h-full shrink-0 grow-0 overflow-x-hidden transition-all duration-(--layout-duration)",
          layout.leftShowBackdrop && "z-20",
        )}
        style:width={(activeVisibleChildren.length > 0 || Boolean(activeItem?.content)) &&
        layout.leftSecondaryCurrent !== MenuShowState.Hide &&
        layout.leftMenuWidth.secondary > 0
          ? `${layout.leftMenuWidth.secondary}px`
          : "0px"}
      >
        <div class="h-full w-full">
          <div class="bg-background-paper h-full w-full rounded-4xl py-3">
            <div class="relative h-full w-full overflow-x-hidden">
              <div
                style:width={`${leftSecondaryDefaultWidth}px`}
                class={cn(
                  "absolute flex h-full min-h-full flex-col gap-2 overflow-y-scroll ps-5.5 pe-4",
                  layout.leftMenuType === MenuType.Minimal ? "py-1.5" : "py-6",
                )}
              >
                {#if !customContentSnippet}
                  {#if activeItem?.label}
                    <p class="font-heading text-primary-fg mb-4 px-2.5 text-lg font-bold">
                      {resolveLabel(translate, activeItem.label)}
                    </p>
                  {/if}
                  <div class="flex h-full w-full flex-1 flex-col justify-between gap-2">
                    <div class="flex w-full flex-1 flex-col gap-1">
                      {#each activeVisibleChildren as item (item.id)}
                        <CoimSecondaryItem
                          {item}
                          {currentPath}
                          indent={0}
                          {openedAccordions}
                          onToggleAccordion={(next) => (openedAccordions = next)}
                          {onNavigate}
                          {translate}
                          onSelect={(selected) => {
                            layout.setMenuSelectedSecondaryItem(selected);
                          }}
                        />
                      {/each}
                    </div>

                    {#if ctaSlot}
                      {@render ctaSlot()}
                    {:else}
                      <a
                        href={ctaHref}
                        onclick={(e) => handleLinkClick(e, ctaHref)}
                        class="group flex w-full cursor-pointer flex-col items-center justify-center gap-2 no-underline"
                      >
                        <IllustrationLaunch class="text-primary-fg h-45 w-45 bg-cover bg-center" />
                        <p class="font-body text-text-primary m-0 px-4 text-center text-base font-normal">
                          {resolveLabel(translate, "menu-cta-copy")}
                        </p>
                        <span class="group-hover:bg-primary/10 text-primary-fg rounded-md px-5 py-2 font-medium transition-colors">
                          {resolveLabel(translate, "menu-cta-button")}
                        </span>
                      </a>
                    {/if}
                  </div>
                {:else}
                  {@render customContentSnippet()}
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
</nav>
