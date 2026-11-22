<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import type { CoimColor } from "../../theme/types.js";
  import { cn } from "../../utilities/utils.js";
  import { FAB_COLOR_CLASSES, FAB_SIZE_CLASSES } from "./styles.js";
  import type { CoimFabSize, CoimFabVariant } from "./types.js";

  interface BaseProps {
    size?: CoimFabSize;
    variant?: CoimFabVariant;
    color?: CoimColor;
    href?: string;
    disabled?: boolean;
    ref?: HTMLButtonElement | HTMLAnchorElement | null;
    class?: string;
    children?: Snippet;
  }

  type Props = BaseProps &
    Omit<HTMLButtonAttributes, keyof BaseProps> &
    Omit<HTMLAnchorAttributes, keyof BaseProps>;

  let {
    size = "large",
    variant = "circular",
    color = "primary",
    href,
    disabled = false,
    type = "button",
    ref = $bindable(null),
    class: className = "",
    children,
    onclick,
    ...rest
  }: Props = $props();

  const computedClass = $derived(
    cn(
      "coim-fab shadow-darker-sm font-body inline-flex h-auto min-h-0 w-auto min-w-0 cursor-pointer items-center justify-center font-medium no-underline transition-all select-none",
      `coim-fab-color-${color}`,
      FAB_SIZE_CLASSES[size][variant],
      FAB_COLOR_CLASSES[color],
      disabled && "coim-fab-disabled opacity-disabled pointer-events-none cursor-default",
      className,
    ),
  );

  function handleLinkClick(e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }) {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onclick) {
      (onclick as (ev: MouseEvent) => void)(e);
    }
  }
</script>

{#if href !== undefined}
  <a
    bind:this={ref}
    href={disabled ? undefined : href}
    aria-disabled={disabled ? "true" : undefined}
    tabindex={disabled ? -1 : undefined}
    class={computedClass}
    onclick={handleLinkClick}
    {...rest}
  >
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else}
  <button bind:this={ref} {type} {disabled} class={computedClass} {onclick} {...rest}>
    {#if children}
      {@render children()}
    {/if}
  </button>
{/if}
