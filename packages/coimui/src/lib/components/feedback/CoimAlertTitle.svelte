<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  }

  let { class: className = "", children, ...rest }: Props = $props();
</script>

<div
  class={cn("coim-alert-title font-body mb-1 text-base leading-5 font-semibold", className)}
  {...rest}
>
  {@render children?.()}
</div>
