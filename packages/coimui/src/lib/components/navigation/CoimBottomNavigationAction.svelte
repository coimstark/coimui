<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import { getBottomNavigationContext } from "./context.js";

  interface Props {
    label: string;
    value?: string | number;
    icon?: Snippet;
    showLabel?: boolean;
    href?: string;
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
    class?: string;
  }

  let {
    label,
    value: valueProp,
    icon,
    showLabel,
    href,
    disabled = false,
    onclick,
    class: className = "",
  }: Props = $props();

  const ctx = getBottomNavigationContext();
  const autoIndex = ctx.assignIndex();

  const resolvedValue = $derived(valueProp ?? autoIndex);
  const selected = $derived(ctx.value === resolvedValue);
  const labelVisible = $derived(showLabel ?? (ctx.showLabels || selected));

  const actionClass = $derived(
    cn(
      "coim-bottom-navigation-action",
      selected && "is-selected",
      disabled && "is-disabled",
      className,
    ),
  );

  function handleClick(event: MouseEvent) {
    if (disabled) {
      event.preventDefault();
      return;
    }
    ctx.select(resolvedValue, event);
    onclick?.(event);
  }
</script>

{#if href}
  <a
    href={disabled ? undefined : href}
    aria-current={selected ? "page" : undefined}
    aria-disabled={disabled || undefined}
    class={actionClass}
    onclick={handleClick}
  >
    {#if icon}
      <span class="coim-bottom-navigation-action-icon" aria-hidden="true">
        {@render icon()}
      </span>
    {/if}
    <span class={cn("coim-bottom-navigation-action-label", !labelVisible && "is-hidden")}>
      {label}
    </span>
  </a>
{:else}
  <button
    type="button"
    {disabled}
    aria-pressed={selected}
    class={actionClass}
    onclick={handleClick}
  >
    {#if icon}
      <span class="coim-bottom-navigation-action-icon" aria-hidden="true">
        {@render icon()}
      </span>
    {/if}
    <span class={cn("coim-bottom-navigation-action-label", !labelVisible && "is-hidden")}>
      {label}
    </span>
  </button>
{/if}
