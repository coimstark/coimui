<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { setTimelineContext } from "./timeline-context.js";
  import type { TimelinePosition } from "./types.js";

  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, "class" | "children"> {
    position?: TimelinePosition;
    class?: string;
    children?: Snippet;
  }

  let {
    position = "right",
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  setTimelineContext({
    get position() {
      return position;
    },
  });
</script>

<ul
  class={cn("coim-timeline", `coim-timeline-position-${position}`, className)}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</ul>
