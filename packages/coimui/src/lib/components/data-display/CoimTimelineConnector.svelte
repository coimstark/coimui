<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn } from "../../utilities/utils.js";

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, "class"> {
    class?: string;
  }

  let { class: className = "", ...rest }: Props = $props();
</script>

<span aria-hidden="true" class={cn("coim-timeline-connector", className)} {...rest}></span>
