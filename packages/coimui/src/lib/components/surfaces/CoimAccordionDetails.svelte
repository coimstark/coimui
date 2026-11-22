<script lang="ts">
  import type { Snippet } from "svelte";
  import { Accordion } from "bits-ui";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    forceMount?: boolean;
    hiddenUntilFound?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    forceMount,
    hiddenUntilFound = false,
    class: className = "",
    children,
  }: Props = $props();
</script>

<Accordion.Content
  {forceMount}
  {hiddenUntilFound}
  class={cn("coim-accordion-details", className)}
>
  {@render children?.()}
</Accordion.Content>
