<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    primary?: string | Snippet;
    secondary?: string | Snippet;
    inset?: boolean;
    primaryClass?: string;
    secondaryClass?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    primary,
    secondary,
    inset = false,
    primaryClass = "",
    secondaryClass = "",
    class: className = "",
    children,
    ...rest
  }: Props = $props();
</script>

<div {...rest} class={cn("coim-list-item-text", inset && "coim-list-item-text-inset", className)}>
  {#if primary !== undefined}
    <span class={cn("coim-list-item-primary", primaryClass)}>
      {#if typeof primary === "function"}
        {@render primary()}
      {:else}
        {primary}
      {/if}
    </span>
  {:else if children}
    <span class={cn("coim-list-item-primary", primaryClass)}>
      {@render children()}
    </span>
  {/if}

  {#if secondary !== undefined}
    <span class={cn("coim-list-item-secondary", secondaryClass)}>
      {#if typeof secondary === "function"}
        {@render secondary()}
      {:else}
        {secondary}
      {/if}
    </span>
  {/if}
</div>
