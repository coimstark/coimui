<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import {
    BUTTON_COLOR_CLASSES,
    ICON_BUTTON_OUTLINED_SIZE_CLASSES,
    ICON_BUTTON_SIZE_CLASSES,
  } from "./styles.js";
  import type { CoimButtonSize, CoimButtonVariant } from "./types.js";

  interface BaseProps {
    variant?: CoimButtonVariant;
    size?: CoimButtonSize;
    color?: CoimColor;
    href?: string;
    edge?: "start" | "end" | false;
    loading?: boolean;
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
    variant = "text",
    size = "medium",
    color = "text-primary",
    href,
    edge = false,
    loading = false,
    surfaceStandard = false,
    active = false,
    disabled = false,
    type = "button",
    ref = $bindable(null),
    class: className = "",
    children,
    onclick,
    ...rest
  }: Props = $props();

  const isDisabled = $derived(Boolean(disabled || loading));

  const edgeClass = $derived(edge === "start" ? "-ms-2" : edge === "end" ? "-me-2" : "");

  const computedClass = $derived(
    cn(
      "coim-btn-base coim-icon-btn coim-btn-icon-only icon-only min-w-0 shrink-0",
      `coim-btn-${variant}`,
      `coim-btn-color-${color}`,
      variant === "outlined" ? ICON_BUTTON_OUTLINED_SIZE_CLASSES[size] : ICON_BUTTON_SIZE_CLASSES[size],
      BUTTON_COLOR_CLASSES[variant][color],
      variant === "outlined" && "border border-solid bg-transparent",
      variant === "surface" &&
        (surfaceStandard
          ? "surface-standard bg-background-paper shadow-darker-xs outline-line outline -outline-offset-1 backdrop-blur-xs hover:text-primary"
          : "bg-transparent outline -outline-offset-1 outline-transparent hover:bg-background-paper hover:shadow-darker-sm hover:outline-line hover:backdrop-blur-xs"),
      edgeClass,
      active && "active",
      isDisabled && "coim-btn-disabled opacity-disabled pointer-events-none cursor-default",
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

{#snippet innerContent()}
  {#if loading}
    <svg class="coim-btn-spinner animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.5" stroke-opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
    </svg>
  {:else if children}
    {@render children()}
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
    {@render innerContent()}
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
    {@render innerContent()}
  </button>
{/if}
