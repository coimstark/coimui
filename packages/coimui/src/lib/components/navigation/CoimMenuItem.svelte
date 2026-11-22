<script lang="ts">
  import { DropdownMenu } from "bits-ui";
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    label?: string;
    secondaryText?: string;
    hint?: string;
    icon?: Snippet;
    selected?: boolean;
    disabled?: boolean;
    closeOnSelect?: boolean;
    textValue?: string;
    onSelect?: (event: Event) => void;
    class?: string;
    children?: Snippet;
  }

  let {
    label,
    secondaryText,
    hint,
    icon,
    selected = false,
    disabled = false,
    closeOnSelect = true,
    textValue,
    onSelect,
    class: className = "",
    children,
  }: Props = $props();
</script>

<DropdownMenu.Item
  {disabled}
  {closeOnSelect}
  textValue={textValue ?? label}
  {onSelect}
  aria-selected={selected || undefined}
  class={cn(
    "coim-menu-item",
    selected && "is-selected",
    disabled && "is-disabled",
    className,
  )}
>
  {#if icon}
    <span class="coim-menu-item-icon" aria-hidden="true">
      {@render icon()}
    </span>
  {/if}

  <span class="coim-menu-item-text">
    {#if children}
      {@render children()}
    {:else if label}
      {label}
    {/if}
    {#if secondaryText}
      <span class="coim-menu-item-secondary">{secondaryText}</span>
    {/if}
  </span>

  {#if hint}
    <span class="coim-menu-hint">{hint}</span>
  {/if}
</DropdownMenu.Item>
