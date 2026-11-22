<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends Omit<HTMLAttributes<HTMLElement>, "class" | "children"> {
    disableSticky?: boolean;
    disableGutters?: boolean;
    inset?: boolean;
    component?: "li" | "div";
    class?: string;
    children?: Snippet;
  }

  let {
    disableSticky = false,
    disableGutters = false,
    inset = false,
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
    "coim-list-subheader",
    !disableSticky && "is-sticky",
    inset && "is-inset",
    disableGutters && "px-0!",
    className,
  )}
>
  {@render children?.()}
</svelte:element>
