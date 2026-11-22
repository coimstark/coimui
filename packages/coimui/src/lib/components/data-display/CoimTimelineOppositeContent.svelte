<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { tryGetTimelineItemContext } from "./timeline-context.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    class?: string;
    children?: Snippet;
  }

  let { class: className = "", children, ...rest }: Props = $props();

  const itemCtx = tryGetTimelineItemContext();

  $effect(() => {
    if (!itemCtx) return;
    return itemCtx.registerOppositeContent();
  });
</script>

<div class={cn("coim-timeline-opposite-content", className)} {...rest}>
  {#if children}
    {@render children()}
  {/if}
</div>
