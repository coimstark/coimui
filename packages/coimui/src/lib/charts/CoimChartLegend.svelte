<script lang="ts">
  import { cn } from "../utilities/utils.js";
  import type { CoimLegendEntry } from "./types.js";

  interface Props {
    items: CoimLegendEntry[];
    onToggle?: (key: string) => void;
    class?: string;
  }

  let { items, onToggle, class: className = "" }: Props = $props();
</script>

{#if items.length > 0}
  <div class={cn("coim-chart-legend", className)} role="group" aria-label="Chart legend">
    {#each items as item (item.key)}
      <button
        type="button"
        class="coim-chart-legend-item"
        aria-pressed={item.visible}
        onclick={() => onToggle?.(item.key)}
      >
        <span class="coim-chart-legend-swatch" style={`background-color: ${item.color};`}></span>
        <span>{item.label}</span>
      </button>
    {/each}
  </div>
{/if}
