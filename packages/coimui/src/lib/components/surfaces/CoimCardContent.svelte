<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    class?: string;
    children?: Snippet;
  }

  let { class: className = "", children, ...rest }: Props = $props();
</script>

<div class={cn("coim-card-content", className)} {...rest}>
  {@render children?.()}
</div>
