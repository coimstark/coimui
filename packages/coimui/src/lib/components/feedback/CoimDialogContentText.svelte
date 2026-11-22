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
  const resolvedId = $derived(id ?? ctx?.defaultDescriptionId);

  $effect(() => {
    if (!ctx || !resolvedId) return;
    return ctx.registerDescription(resolvedId);
  });
</script>

<p
  id={resolvedId}
  class={cn(
    "coim-dialog-content-text font-body text-text-primary m-0 text-base leading-relaxed",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</p>
