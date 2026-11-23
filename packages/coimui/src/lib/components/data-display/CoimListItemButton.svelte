<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { tryGetListContext } from "./list-context.js";

  interface Props {
    selected?: boolean;
    active?: boolean;
    disabled?: boolean;
    href?: string;
    dense?: boolean;
    alignItems?: "center" | "flex-start";
    disableGutters?: boolean;
    disableListItemWrapper?: boolean;
    role?: string;
    onclick?: (event: MouseEvent) => void;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    selected = false,
    active = false,
    disabled = false,
    href,
    dense,
    alignItems = "center",
    disableGutters = false,
    disableListItemWrapper = false,
    role,
    onclick,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const listCtx = tryGetListContext();
  const isDense = $derived(dense ?? listCtx?.dense ?? false);
  const wrapInListItem = $derived(Boolean(listCtx) && !disableListItemWrapper);
  const supportsAriaSelected = $derived(
    role === "option" || role === "tab" || role === "treeitem" || role === "gridcell" || role === "row",
  );

  const itemClasses = $derived(
    cn(
      "coim-list-item-button",
      isDense && "coim-list-dense",
      alignItems === "flex-start" && "items-start",
      disableGutters && "px-0!",
      selected && "is-selected",
      active && "active",
      disabled && "is-disabled",
      className,
    ),
  );
</script>

{#snippet control()}
  {#if href}
    <a
      {...(rest as HTMLAnchorAttributes)}
      href={disabled ? undefined : href}
      {role}
      aria-selected={supportsAriaSelected && selected ? "true" : undefined}
      aria-current={!supportsAriaSelected && selected ? "true" : undefined}
      aria-disabled={disabled ? "true" : undefined}
      class={itemClasses}
      onclick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onclick?.(e);
      }}
    >
      {@render children?.()}
    </a>
  {:else}
    <button
      {...(rest as HTMLButtonAttributes)}
      type="button"
      {disabled}
      {role}
      aria-selected={supportsAriaSelected && selected ? "true" : undefined}
      aria-current={!supportsAriaSelected && selected ? "true" : undefined}
      class={itemClasses}
      {onclick}
    >
      {@render children?.()}
    </button>
  {/if}
{/snippet}

{#if wrapInListItem}
  <li class="coim-list-item-button-li m-0 w-full list-none p-0">
    {@render control()}
  </li>
{:else}
  {@render control()}
{/if}
