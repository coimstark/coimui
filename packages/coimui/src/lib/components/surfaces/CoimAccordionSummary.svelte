<script lang="ts">
  import type { Snippet } from "svelte";
  import { Accordion } from "bits-ui";
  import CiChevronRightSmall from "../../icons/ui/CiChevronRightSmall.svelte";
  import { cn } from "../../utilities/utils.js";

  interface Props {
    expandIcon?: Snippet | false;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    class?: string;
    children?: Snippet;
  }

  let {
    expandIcon,
    level = 3,
    class: className = "",
    children,
  }: Props = $props();
</script>

<Accordion.Header {level} class="coim-accordion-header">
  <Accordion.Trigger class={cn("coim-accordion-summary", className)}>
    <span class="coim-accordion-summary-content">
      {@render children?.()}
    </span>
    {#if expandIcon !== false}
      <span class="coim-accordion-expand-icon" aria-hidden="true">
        {#if expandIcon}
          {@render expandIcon()}
        {:else}
          <CiChevronRightSmall size="medium" class="accordion-rotate" />
        {/if}
      </span>
    {/if}
  </Accordion.Trigger>
</Accordion.Header>
