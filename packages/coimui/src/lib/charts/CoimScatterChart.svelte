<script lang="ts">
  import { Points, ScatterChart } from "layerchart";
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

  let containerWidth = $state(0);
  const chartWidth = $derived(containerWidth > 0 ? Math.max(240, Math.floor(containerWidth)) : 600);

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

  <div
    bind:clientWidth={containerWidth}
    class="coim-chart-container"
    role="img"
    aria-label={title ?? ariaLabel}
    style={`height: ${height}px;`}
  >
    <ScatterChart
      ssr
      width={chartWidth}
      {height}
      x="x"
      y="y"
      series={groupedSeries}
      {grid}
      axis={true}
      padding={{ top: 16, right: 16, bottom: 28, left: 40 }}
    >
      {#snippet marks({ context })}
        {#each context.series.visibleSeries as s (s.key)}
          <Points
            seriesKey={s.key}
            fillOpacity={0.16}
            stroke={s.color}
            strokeWidth={2}
          />
        {/each}
      {/snippet}
    </ScatterChart>
  </div>
</div>
