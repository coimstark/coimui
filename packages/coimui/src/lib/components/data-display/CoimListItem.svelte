<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends Omit<HTMLAttributes<HTMLElement>, "class" | "children"> {
    disablePadding?: boolean;
    disableGutters?: boolean;
    alignItems?: "center" | "flex-start";
    secondaryAction?: Snippet;
    component?: "li" | "div";
    class?: string;
    children?: Snippet;
  }

  let {
    disablePadding = false,
    disableGutters = false,
    alignItems = "center",
    secondaryAction,
    component = "li",
    class: className = "",
    children,
    ...rest
  }: Props = $props();
</script>

<svelte:element
  this={component}
  {...rest}
  class={cn(
    "coim-list-item",
    !disablePadding && "coim-list-item-padding",
    !disableGutters && disablePadding && "coim-list-item-gutters",
    alignItems === "flex-start" && "coim-list-item-align-start",
    className,
  )}
>
  {@render children?.()}
  {#if secondaryAction}
    <div class="coim-list-item-secondary-action">
      {@render secondaryAction()}
    </div>
  {/if}
</svelte:element>
