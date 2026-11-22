<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";
  import { tryGetStepContext } from "./context.js";

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "class" | "children"> {
    open?: boolean;
    class?: string;
    children?: Snippet;
  }

  let { open, class: className = "", children, ...rest }: Props = $props();

  const stepCtx = tryGetStepContext();
  const isOpen = $derived(open ?? stepCtx?.active ?? true);
</script>

<div class={cn("coim-step-content", className)} hidden={!isOpen} {...rest}>
  {#if isOpen && children}
    {@render children()}
  {/if}
</div>
