<script lang="ts">
  import { Tooltip } from "bits-ui";
  import {
    RadiobuttonSmallChecked,
    RadiobuttonSmallEmptyOutlined,
  } from "../icons/form/index.js";
  import CiArrowCircleLeft from "../icons/ui/CiArrowCircleLeft.svelte";
  import CiArrowOutDown from "../icons/ui/CiArrowOutDown.svelte";
  import CiArrowOutUp from "../icons/ui/CiArrowOutUp.svelte";
  import CiBasket from "../icons/ui/CiBasket.svelte";
  import CiButton from "../icons/ui/CiButton.svelte";
  import CiButtonGroup from "../icons/ui/CiButtonGroup.svelte";
  import CiChevronLeftRightReverseSmall from "../icons/ui/CiChevronLeftRightReverseSmall.svelte";
  import CiChevronLeftRightSmall from "../icons/ui/CiChevronLeftRightSmall.svelte";
  import CiKnobs from "../icons/ui/CiKnobs.svelte";
  import CiMenu from "../icons/ui/CiMenu.svelte";
  import CiMenuSplit from "../icons/ui/CiMenuSplit.svelte";
  import CiMenuSplitDot from "../icons/ui/CiMenuSplitDot.svelte";
  import CiMoon from "../icons/ui/CiMoon.svelte";
  import CiPalette from "../icons/ui/CiPalette.svelte";
  import CiScreen from "../icons/ui/CiScreen.svelte";
  import CiSun from "../icons/ui/CiSun.svelte";
  import { getThemeContext } from "../theme/theme-state.svelte.js";
  import {
    ContentType,
    Elevation,
    MenuType,
    THEME_OPTIONS,
    TopNavType,
    type ModeVariant,
  } from "../theme/types.js";
  import { cn } from "../utilities/utils.js";
  import { getLayoutContext } from "./layout-state.svelte.js";
  import { resolveLabel } from "./nav-utils.js";
  import type { NavigateFn, TranslateFn } from "./types.js";

  interface Props {
    translate?: TranslateFn;
    purchaseHref?: string;
    showPurchaseLink?: boolean;
    onNavigate?: NavigateFn;
  }

  let {
    translate = (k) => k,
    purchaseHref = "/pages/pricing",
    showPurchaseLink = true,
    onNavigate,
  }: Props = $props();

  const theme = getThemeContext();
  const layout = getLayoutContext();

  let openDrawer = $state(false);
  let drawerDialog = $state<HTMLDialogElement | null>(null);
  let pressedOutside = false;

  $effect(() => {
    if (!drawerDialog) return;
    if (openDrawer && !drawerDialog.open) {
      drawerDialog.showModal();
    } else if (!openDrawer && drawerDialog.open) {
      drawerDialog.close();
    }
  });

  function handleResetTheme() {
    theme.reset();
    layout.setLeftMenuType(theme.defaults.leftMenuType);
  }

  function handleDialogClose() {
    if (drawerDialog) drawerDialog.returnValue = "";
    openDrawer = false;
  }

  function isPointerOutside(e: PointerEvent, el: HTMLDialogElement): boolean {
    const r = el.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  }

  function handlePointerDown(e: PointerEvent) {
    if (!drawerDialog || "closedBy" in HTMLDialogElement.prototype) return;
    pressedOutside = isPointerOutside(e, drawerDialog);
  }

  function handlePointerUp(e: PointerEvent) {
    if (!drawerDialog || "closedBy" in HTMLDialogElement.prototype) return;
    if (pressedOutside && isPointerOutside(e, drawerDialog)) {
      openDrawer = false;
    }
    pressedOutside = false;
  }

  const themeModeOptions: { value: ModeVariant }[] = [
    { value: "system" },
    { value: "light" },
    { value: "dark" },
  ];

  const leftMenuOptions: { value: MenuType }[] = [
    { value: MenuType.Minimal },
    { value: MenuType.Comfort },
    { value: MenuType.SingleLayer },
  ];

  const contentOptions: { value: ContentType }[] = [
    { value: ContentType.Boxed },
    { value: ContentType.Fluid },
  ];

  const topNavOptions: { value: TopNavType }[] = [
    { value: TopNavType.Contained },
    { value: TopNavType.Full },
  ];

  const elevationOptions: { value: Elevation }[] = [
    { value: Elevation.Elevated },
    { value: Elevation.Flat },
  ];

  function themeSwatchColor(option: string, isDark: boolean): string {
    switch (option) {
      case THEME_OPTIONS.BLUE:
        return isDark ? "#22B2D6" : "#007C9E";
      case THEME_OPTIONS.GREEN:
        return isDark ? "#62B834" : "#3D8218";
      case THEME_OPTIONS.ORANGE:
        return isDark ? "#E89226" : "#B86300";
      case THEME_OPTIONS.PURPLE:
      default:
        return isDark ? "#D85EC9" : "#B124A4";
    }
  }

  const optionBtnClass =
    "bg-background-paper hover:bg-grey-25! text-text-primary font-body flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-transparent px-4 py-2 text-base font-medium shadow-none! outline-none! transition-colors";
</script>

<div
  class={cn(
    "bg-background-paper shadow-darker-xs fixed inset-e-0 bottom-4 z-20 flex w-13 flex-col gap-2 rounded-s-3xl p-2 transition-opacity md:top-1/2 md:bottom-auto md:w-15 md:-translate-y-1/2 md:p-2.5",
    layout.leftShowBackdrop && "pointer-events-none opacity-0",
  )}
>
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          {...props}
          id="themeCustomization"
          type="button"
          aria-label="Theme configuration"
          onclick={() => (openDrawer = true)}
          class="icon-only text-primary hover:bg-grey-25 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent transition-colors"
        >
          <CiKnobs size="large" />
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        side="left"
        sideOffset={8}
        class="border-grey-200 bg-background-paper font-body text-text-primary shadow-darker-sm z-100 rounded-sm border border-solid px-3 py-1.5 text-sm font-semibold"
      >
        <Tooltip.Arrow class="text-background-paper fill-current" />
        Configuration
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>

  {#if showPurchaseLink && purchaseHref}
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <a
            {...props}
            href={purchaseHref}
            aria-label="Plans"
            onclick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate(purchaseHref);
              }
            }}
            class="icon-only text-secondary hover:bg-grey-25 inline-flex h-10 w-full items-center justify-center rounded-lg no-underline transition-colors"
          >
            <CiBasket size="large" />
          </a>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="left"
          sideOffset={8}
          class="border-grey-200 bg-background-paper font-body text-text-primary shadow-darker-sm z-100 rounded-sm border border-solid px-3 py-1.5 text-sm font-semibold"
        >
          <Tooltip.Arrow class="text-background-paper fill-current" />
          Plans
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  {/if}
</div>

<dialog
  bind:this={drawerDialog}
  closedby="any"
  aria-labelledby="coim-theme-config-title"
  onclose={handleDialogClose}
  onpointerdown={handlePointerDown}
  onpointerup={handlePointerUp}
  class="bg-background-paper text-text-primary shadow-darker-lg fixed inset-y-0 inset-s-auto inset-e-0 m-0 h-dvh max-h-dvh w-80 max-w-full flex-col overflow-y-auto rounded-s-2xl border-0 p-0 backdrop:bg-black/40 open:flex"
>
  <div class="flex min-h-full min-w-80 flex-col p-5">
    <h2 id="coim-theme-config-title" class="card-title font-heading text-text-primary px-4 pt-4 text-lg font-bold">
      Configuration
    </h2>

    <div class="mb-4 flex flex-1 flex-col gap-2 px-5">
      <div class="font-body text-sm font-semibold">{resolveLabel(translate, "palette")}</div>
      <div class="flex flex-col gap-2">
        {#each Object.values(THEME_OPTIONS) as option (option)}
          <div class={cn(option, theme.resolvedMode)}>
            <button
              type="button"
              onclick={() => theme.setTheme(option)}
              class={cn(
                optionBtnClass,
                theme.theme === option && "active bg-grey-25! text-primary!",
              )}
            >
              <span class="flex items-center gap-2">
                <span style={`color: ${themeSwatchColor(option, theme.resolvedMode === "dark")};`} class="inline-flex">
                  <CiPalette />
                </span>
                <span>{resolveLabel(translate, option)}</span>
              </span>
              <span class={cn("flex justify-end", theme.theme !== option ? "text-grey-200" : "text-primary")}>
                {#if theme.theme === option}
                  <RadiobuttonSmallChecked />
                {:else}
                  <RadiobuttonSmallEmptyOutlined />
                {/if}
              </span>
            </button>
          </div>
        {/each}
      </div>

      <hr class="border-grey-100 my-2 border-0 border-t" />
      <div class="font-body text-sm font-semibold">{resolveLabel(translate, "mode")}</div>
      <div class="flex flex-col gap-2">
        {#each themeModeOptions as option (option.value)}
          <button
            type="button"
            onclick={() => theme.setMode(option.value)}
            class={cn(
              optionBtnClass,
              theme.mode === option.value && "active bg-grey-25! text-primary!",
            )}
          >
            <span class="flex items-center gap-2">
              {#if option.value === "system"}
                <CiScreen />
              {:else if option.value === "light"}
                <CiSun />
              {:else}
                <CiMoon />
              {/if}
              <span>{resolveLabel(translate, `mode-${option.value}`)}</span>
            </span>
            <span class={cn("flex justify-end", theme.mode !== option.value ? "text-grey-200" : "text-primary")}>
              {#if theme.mode === option.value}
                <RadiobuttonSmallChecked />
              {:else}
                <RadiobuttonSmallEmptyOutlined />
              {/if}
            </span>
          </button>
        {/each}
      </div>

      <hr class="border-grey-100 my-2 border-0 border-t" />
      <div class="font-body text-sm font-semibold">{resolveLabel(translate, "left-menu")}</div>
      <div class="flex flex-col gap-2">
        {#each leftMenuOptions as option (option.value)}
          <button
            type="button"
            onclick={() => layout.setLeftMenuType(option.value)}
            class={cn(
              optionBtnClass,
              layout.leftMenuType === option.value && "active bg-grey-25! text-primary!",
            )}
          >
            <span class="flex items-center gap-2">
              {#if option.value === MenuType.Minimal}
                <CiMenuSplitDot />
              {:else if option.value === MenuType.Comfort}
                <CiMenuSplit />
              {:else}
                <CiMenu />
              {/if}
              <span>{resolveLabel(translate, `menu-${option.value}`)}</span>
            </span>
            <span
              class={cn(
                "flex justify-end",
                layout.leftMenuType !== option.value ? "text-grey-200" : "text-primary",
              )}
            >
              {#if layout.leftMenuType === option.value}
                <RadiobuttonSmallChecked />
              {:else}
                <RadiobuttonSmallEmptyOutlined />
              {/if}
            </span>
          </button>
        {/each}
      </div>

      <hr class="border-grey-100 my-2 border-0 border-t" />
      <div class="font-body text-sm font-semibold">{resolveLabel(translate, "content")}</div>
      <div class="flex flex-col gap-2">
        {#each contentOptions as option (option.value)}
          <button
            type="button"
            onclick={() => theme.setContent(option.value)}
            class={cn(
              optionBtnClass,
              theme.content === option.value && "active bg-grey-25! text-primary!",
            )}
          >
            <span class="flex items-center gap-2">
              {#if option.value === ContentType.Boxed}
                <CiChevronLeftRightReverseSmall />
              {:else}
                <CiChevronLeftRightSmall />
              {/if}
              <span>{resolveLabel(translate, `content-${option.value}`)}</span>
            </span>
            <span
              class={cn(
                "flex justify-end",
                theme.content !== option.value ? "text-grey-200" : "text-primary",
              )}
            >
              {#if theme.content === option.value}
                <RadiobuttonSmallChecked />
              {:else}
                <RadiobuttonSmallEmptyOutlined />
              {/if}
            </span>
          </button>
        {/each}
      </div>

      <hr class="border-grey-100 my-2 border-0 border-t" />
      <div class="font-body text-sm font-semibold">{resolveLabel(translate, "top-nav")}</div>
      <div class="flex flex-col gap-2">
        {#each topNavOptions as option (option.value)}
          <button
            type="button"
            onclick={() => theme.setTopNav(option.value)}
            class={cn(
              optionBtnClass,
              theme.topNav === option.value && "active bg-grey-25! text-primary!",
            )}
          >
            <span class="flex items-center gap-2">
              {#if option.value === TopNavType.Contained}
                <CiButtonGroup />
              {:else}
                <CiButton />
              {/if}
              <span>{resolveLabel(translate, `top-nav-${option.value}`)}</span>
            </span>
            <span
              class={cn(
                "flex justify-end",
                theme.topNav !== option.value ? "text-grey-200" : "text-primary",
              )}
            >
              {#if theme.topNav === option.value}
                <RadiobuttonSmallChecked />
              {:else}
                <RadiobuttonSmallEmptyOutlined />
              {/if}
            </span>
          </button>
        {/each}
      </div>

      <hr class="border-grey-100 my-2 border-0 border-t" />
      <div class="font-body text-sm font-semibold">{resolveLabel(translate, "elevation")}</div>
      <div class="flex flex-col gap-2">
        {#each elevationOptions as option (option.value)}
          <button
            type="button"
            onclick={() => theme.setElevation(option.value)}
            class={cn(
              optionBtnClass,
              theme.elevation === option.value && "active bg-grey-25! text-primary!",
            )}
          >
            <span class="flex items-center gap-2">
              {#if option.value === Elevation.Elevated}
                <CiArrowOutUp />
              {:else}
                <CiArrowOutDown />
              {/if}
              <span>{resolveLabel(translate, `elevation-${option.value}`)}</span>
            </span>
            <span
              class={cn(
                "flex justify-end",
                theme.elevation !== option.value ? "text-grey-200" : "text-primary",
              )}
            >
              {#if theme.elevation === option.value}
                <RadiobuttonSmallChecked />
              {:else}
                <RadiobuttonSmallEmptyOutlined />
              {/if}
            </span>
          </button>
        {/each}
      </div>
    </div>

    <div class="mt-auto flex w-full px-5 pb-4">
      <button
        type="button"
        onclick={handleResetTheme}
        class="border-grey-200 text-text-primary hover:bg-grey-200/10 font-body inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xs border border-solid bg-transparent px-3.5 py-1.5 text-sm leading-4 font-medium transition-colors"
      >
        <CiArrowCircleLeft size="small" />
        <span>{resolveLabel(translate, "reset-theme")}</span>
      </button>
    </div>
  </div>
</dialog>
