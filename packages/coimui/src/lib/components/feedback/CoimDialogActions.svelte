<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    disableSpacing?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let {
    disableSpacing = false,
    class: className = "",
    children,
    ...rest
  }: Props = $props();
</script>

<div
  class={cn(
    "coim-dialog-actions flex shrink-0 flex-wrap items-center justify-end gap-2 p-7 pt-4",
    disableSpacing && "gap-0",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
