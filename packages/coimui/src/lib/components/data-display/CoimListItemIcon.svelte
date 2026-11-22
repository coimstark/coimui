<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "class" | "children"> {
    class?: string;
    children?: Snippet;
  }

  let { class: className = "", children, ...rest }: Props = $props();
</script>

<span {...rest} class={cn("coim-list-item-icon", className)}>
  {@render children?.()}
</span>
