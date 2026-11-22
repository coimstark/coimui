<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import type { TimelineDotColor, TimelineDotVariant } from "./types.js";

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "class" | "children"> {
    variant?: TimelineDotVariant;
    color?: TimelineDotColor;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = "filled",
    color = "grey",
    class: className = "",
    children,
    ...rest
  }: Props = $props();
</script>

<span
  class={cn(
    "coim-timeline-dot",
    `coim-timeline-dot-${variant}`,
    `coim-timeline-dot-color-${color}`,
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</span>
