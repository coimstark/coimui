<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { tryGetButtonGroupContext } from "./context.svelte.js";
  import {
    BUTTON_COLOR_CLASSES,
    BUTTON_OUTLINED_SIZE_CLASSES,
    BUTTON_SIZE_CLASSES,
    ICON_BUTTON_OUTLINED_SIZE_CLASSES,
    ICON_BUTTON_SIZE_CLASSES,
  } from "./styles.js";
  import type { CoimButtonSize, CoimButtonVariant, CoimLoadingPosition } from "./types.js";

  interface BaseProps {
    variant?: CoimButtonVariant;
    size?: CoimButtonSize;
    color?: CoimColor;
    iconOnly?: boolean;
    hoverIconShrink?: boolean;
    startIcon?: Snippet;
    endIcon?: Snippet;
    loading?: boolean;
    loadingPosition?: CoimLoadingPosition;
    href?: string;
    fullWidth?: boolean;
    surfaceStandard?: boolean;
    active?: boolean;
    disabled?: boolean;
    ref?: HTMLButtonElement | HTMLAnchorElement | null;
    class?: string;
    children?: Snippet;
  }

  type Props = BaseProps &
    Omit<HTMLButtonAttributes, keyof BaseProps> &
    Omit<HTMLAnchorAttributes, keyof BaseProps>;

  let {
    variant: variantProp,
    size: sizeProp,
    color: colorProp,
    iconOnly = false,
    hoverIconShrink = false,
    startIcon,
    endIcon,
    loading = false,
    loadingPosition = "center",
    href,
    fullWidth: fullWidthProp,
    surfaceStandard = false,
    active = false,
    disabled: disabledProp,
    type = "button",
    ref = $bindable(null),
    class: className = "",
    children,
    onclick,
    ...rest
  }: Props = $props();

  const groupCtx = tryGetButtonGroupContext();

  const variant = $derived(variantProp ?? groupCtx?.variant ?? "contained");
  const size = $derived(sizeProp ?? groupCtx?.size ?? "medium");
  const color = $derived(colorProp ?? groupCtx?.color ?? "primary");
  const fullWidth = $derived(fullWidthProp ?? false);
  const isDisabled = $derived(Boolean(disabledProp ?? groupCtx?.disabled ?? false) || loading);
  const isIconOnly = $derived(iconOnly || (!children && Boolean(startIcon || endIcon)));

  const spinnerSizeClass = $derived(
    size === "large"
      ? "h-[1.125rem] w-[1.125rem]"
      : size === "tiny"
        ? "h-[0.875rem] w-[0.875rem]"
        : "h-4 w-4",
  );

  const resolvedSizeClass = $derived.by(() => {
    if (isIconOnly) {
      return variant === "outlined"
        ? ICON_BUTTON_OUTLINED_SIZE_CLASSES[size]
        : ICON_BUTTON_SIZE_CLASSES[size];
    }
    return variant === "outlined" ? BUTTON_OUTLINED_SIZE_CLASSES[size] : BUTTON_SIZE_CLASSES[size];
  });

  const computedClass = $derived(
    cn(
      "coim-btn-base relative",
      `coim-btn-${variant}`,
      `coim-btn-color-${color}`,
      resolvedSizeClass,
      BUTTON_COLOR_CLASSES[variant][color],
      variant === "outlined" && "border border-solid bg-transparent",
      variant === "surface" &&
        (surfaceStandard
          ? "surface-standard bg-background-paper shadow-darker-xs outline-line outline -outline-offset-1 backdrop-blur-xs hover:text-primary"
          : "bg-transparent outline -outline-offset-1 outline-transparent hover:bg-background-paper hover:shadow-darker-sm hover:outline-line hover:backdrop-blur-xs"),
      isIconOnly && "coim-btn-icon-only icon-only min-w-0",
      hoverIconShrink && "coim-btn-hover-icon-shrink hover-icon-shrink",
      fullWidth && "coim-btn-full-width full-width-button w-full",
      active && "active",
      loading && loadingPosition === "center" && "coim-btn-loading-center opacity-85",
      loading && loadingPosition === "start" && "coim-btn-loading-start",
      loading && loadingPosition === "end" && "coim-btn-loading-end",
      isDisabled && !loading && "coim-btn-disabled opacity-disabled pointer-events-none cursor-default",
      loading && "coim-btn-disabled pointer-events-none cursor-default",
      className,
    ),
  );

  function handleLinkClick(e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onclick) {
      (onclick as (ev: MouseEvent) => void)(e);
    }
  }
</script>

{#snippet spinner()}
  <svg
    class={cn("coim-btn-spinner animate-spin shrink-0", spinnerSizeClass)}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.25" />
    <path
      d="M21 12a9 9 0 0 0-9-9"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
    />
  </svg>
{/snippet}

{#snippet buttonBody()}
  {#if loading && loadingPosition === "start"}
    <span class="coim-btn-icon coim-btn-start-icon coim-btn-loading-indicator">
      {@render spinner()}
    </span>
  {:else if startIcon}
    <span class="coim-btn-icon coim-btn-start-icon">
      {@render startIcon()}
    </span>
  {/if}

  {#if children}
    <span class={cn("inline-flex items-center", loading && loadingPosition === "center" && "opacity-0")}>
      {@render children()}
    </span>
  {/if}

  {#if loading && loadingPosition === "end"}
    <span class="coim-btn-icon coim-btn-end-icon coim-btn-loading-indicator">
      {@render spinner()}
    </span>
  {:else if endIcon}
    <span class="coim-btn-icon coim-btn-end-icon">
      {@render endIcon()}
    </span>
  {/if}

  {#if loading && loadingPosition === "center"}
    <span class="coim-btn-loading-indicator pointer-events-none absolute inset-0 flex items-center justify-center">
      {@render spinner()}
    </span>
  {/if}
{/snippet}

{#if href !== undefined}
  <a
    bind:this={ref}
    href={isDisabled ? undefined : href}
    aria-disabled={isDisabled ? "true" : undefined}
    aria-busy={loading ? "true" : undefined}
    tabindex={isDisabled ? -1 : undefined}
    class={computedClass}
    onclick={handleLinkClick}
    {...rest}
  >
    {@render buttonBody()}
  </a>
{:else}
  <button
    bind:this={ref}
    {type}
    disabled={isDisabled}
    aria-busy={loading ? "true" : undefined}
    class={computedClass}
    {onclick}
    {...rest}
  >
    {@render buttonBody()}
  </button>
{/if}
