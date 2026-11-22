<script lang="ts">
  import type { Snippet } from "svelte";
  import { coimFade, resolveTransitionDuration } from "../../utilities/transitions/transitions.js";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    open?: boolean;
    invisible?: boolean;
    timeout?: number;
    onclick?: (event: MouseEvent) => void;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    open = false,
    invisible = false,
    timeout = 225,
    onclick,
    class: className = "",
    children,
    ...rest
  }: Props = $props();

  const duration = $derived(resolveTransitionDuration(timeout, 225));
</script>

{#if open}
  <div
    data-coim-backdrop="true"
    data-invisible={invisible ? "true" : "false"}
    aria-hidden={!children ? "true" : undefined}
    transition:coimFade={{ duration }}
    {onclick}
    class={cn(
      "coim-backdrop fixed inset-0 z-40 flex items-center justify-center",
      invisible ? "bg-transparent" : "bg-black/50",
      className,
    )}
    {...rest}
  >
    {@render children?.()}
  </div>
{/if}
