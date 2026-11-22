<script lang="ts">
  import { ScatterChart } from "layerchart";
  import { cn } from "../utilities/utils.js";
  import { getChartColor } from "./palette.js";
  import type { CoimScatterDatum } from "./types.js";

  interface Props {
    data: CoimScatterDatum[];
    height?: number;
    grid?: boolean;
    title?: string;
    ariaLabel?: string;
    class?: string;
  }

  let {
    data,
    height = 280,
    grid = true,
    title,
    ariaLabel = "Scatter chart",
    class: className = "",
  }: Props = $props();

  const groupedSeries = $derived.by(() => {
    const names = Array.from(new Set(data.map((d) => d.series ?? "Series")));
    return names.map((name, idx) => ({
      key: name,
      label: name,
      data: data.filter((d) => (d.series ?? "Series") === name),
      color: getChartColor(idx),
    }));
  });
</script>

<div class={cn("coim-chart-root", className)}>
  {#if title}
    <div class="font-heading text-text-primary text-base font-semibold">{title}</div>
  {/if}

  <div class="coim-chart-container" role="img" aria-label={title ?? ariaLabel} style={`height: ${height}px;`}>
    <ScatterChart
      ssr
      width={600}
      {height}
      x="x"
      y="y"
      series={groupedSeries}
      {grid}
      axis={true}
      padding={{ top: 16, right: 16, bottom: 28, left: 40 }}
    />
  </div>
</div>
