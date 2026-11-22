<script lang="ts">
  import { cn } from "../utilities/utils.js";

  interface Props {
    class?: string;
  }

  let { class: className = "" }: Props = $props();
</script>

<div
  class={cn("bg-background fixed inset-0 -z-10 h-full w-full bg-cover", className)}
  aria-hidden="true"
></div>
