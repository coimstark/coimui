<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { setListContext } from "./list-context.js";

  interface Props extends Omit<HTMLAttributes<HTMLElement>, "class" | "children"> {
    dense?: boolean;
    disablePadding?: boolean;
    component?: "ul" | "ol" | "div" | "nav";
    subheader?: Snippet;
    ariaLabel?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    dense = false,
    disablePadding = false,
    component = "ul",
    subheader,
    ariaLabel,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  setListContext({
    get dense() {
      return dense;
    },
  });
</script>

<svelte:element
  this={component}
  aria-label={ariaLabel}
  {...rest}
  class={cn(
    "coim-list",
    dense && "coim-list-dense",
    disablePadding && "coim-list-disable-padding",
    className,
  )}
>
  {#if subheader}
    {@render subheader()}
  {/if}
  {@render children?.()}
</svelte:element>
