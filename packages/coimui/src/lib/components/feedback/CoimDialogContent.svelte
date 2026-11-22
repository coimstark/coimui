<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    dividers?: boolean;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let { dividers = false, class: className = "", children, ...rest }: Props = $props();
</script>

<div
  class={cn(
    "coim-dialog-content flex-1 overflow-y-auto p-7 py-0",
    dividers && "coim-dialog-content-dividers border-grey-100 border-y border-solid py-5",
    className,
  )}
  {...rest}
>
  {@render children?.()}
</div>
