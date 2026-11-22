<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";
  import { tryGetDialogContext } from "./dialog-context.js";

  interface Props {
    id?: string;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let { id, class: className = "", children, ...rest }: Props = $props();

  const ctx = tryGetDialogContext();
  const resolvedId = $derived(id ?? ctx?.defaultTitleId);

  $effect(() => {
    if (!ctx || !resolvedId) return;
    return ctx.registerTitle(resolvedId);
  });
</script>

<h2
  id={resolvedId}
  class={cn(
    "coim-dialog-title font-heading text-text-primary m-0 shrink-0 p-7 pb-4 text-lg leading-6 font-bold",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</h2>
