<script lang="ts">
  import { untrack, type Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { setTimelineItemContext } from "./timeline-context.js";

  interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "class" | "children"> {
    class?: string;
    children?: Snippet;
  }

  let { class: className = "", children, ...rest }: Props = $props();

  let oppositeRegistrations = $state(0);

  setTimelineItemContext({
    registerOppositeContent() {
      untrack(() => {
        oppositeRegistrations += 1;
      });
      return () => {
        untrack(() => {
          oppositeRegistrations = Math.max(0, oppositeRegistrations - 1);
        });
      };
    },
  });
</script>

<li
  class={cn(
    "coim-timeline-item",
    oppositeRegistrations === 0 && "coim-timeline-item-no-opposite",
    className,
  )}
  {...rest}
>
  {#if children}
    {@render children()}
  {/if}
</li>
