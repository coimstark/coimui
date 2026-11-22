<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import type { CoimLinkColor, CoimLinkUnderline, CoimLinkVariant } from "./types.js";

  interface Props {
    href?: string;
    target?: string;
    rel?: string;
    underline?: CoimLinkUnderline;
    variant?: CoimLinkVariant;
    color?: CoimLinkColor;
    disabled?: boolean;
    class?: string;
    onclick?: (event: MouseEvent) => void;
    children?: Snippet;
    anchorProps?: Partial<HTMLAnchorAttributes>;
    buttonProps?: Partial<HTMLButtonAttributes>;
  }

  let {
    href,
    target,
    rel,
    underline = "hover",
    variant = "body1",
    color = "primary",
    disabled = false,
    class: className = "",
    onclick,
    children,
    anchorProps,
    buttonProps,
  }: Props = $props();

  const resolvedRel = $derived(target === "_blank" && !rel ? "noopener noreferrer" : rel);
  const linkClass = $derived(
    cn(
      "coim-link",
      `coim-link-underline-${underline}`,
      `coim-link-variant-${variant}`,
      color === "inherit" ? "coim-link-color-inherit" : `coim-link-color-${color}`,
      disabled && "opacity-disabled pointer-events-none",
      className,
    ),
  );
</script>

{#if href}
  <a
    href={disabled ? undefined : href}
    {target}
    rel={resolvedRel}
    aria-disabled={disabled || undefined}
    class={linkClass}
    onclick={(e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onclick?.(e);
    }}
    {...anchorProps}
  >
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else}
  <button
    type="button"
    {disabled}
    class={linkClass}
    onclick={onclick}
    {...buttonProps}
  >
    {#if children}
      {@render children()}
    {/if}
  </button>
{/if}
