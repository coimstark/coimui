<script lang="ts" generics="TData extends Record<string, unknown> = Record<string, unknown>">
  import { BarChart } from "layerchart";
  import { cn } from "../utilities/utils.js";
  import CoimChartLegend from "./CoimChartLegend.svelte";
  import { getChartColor } from "./palette.js";
  import type { CoimBarChartProps } from "./types.js";

  type Props = CoimBarChartProps<TData>;

  let {
    data,
    xKey,
    series,
    orientation = "vertical",
    layout = "group",
    height = 280,
    showLegend = true,
    grid = true,
    title,
    ariaLabel = "Bar chart",
    class: className = "",
  }: Props = $props();

  let hiddenKeys = $state<Record<string, boolean>>({});
  let containerWidth = $state(0);
  const chartWidth = $derived(containerWidth > 0 ? Math.max(240, Math.floor(containerWidth)) : 600);

  const legendItems = $derived(
    series.map((s, idx) => ({
      key: s.key,
      label: s.label ?? s.key,
      color: getChartColor(idx, s.color),
      visible: !hiddenKeys[s.key],
    })),
  );

  const layerSeries = $derived(
    series.map((s, idx) => ({
      key: s.key,
      label: s.label ?? s.key,
      value: (row: TData) => Number(s.valueAccessor ? s.valueAccessor(row) : row[s.valueKey ?? s.key] ?? 0),
      color: getChartColor(idx, s.color),
      selected: !hiddenKeys[s.key],
    })),
  );
</script>

<div class={cn("coim-chart-root", className)}>
  {#if title}
    <div class="font-heading text-text-primary text-base font-semibold">{title}</div>
  {/if}

  {#if showLegend && series.length > 1}
    <CoimChartLegend
      items={legendItems}
      onToggle={(k) => {
        hiddenKeys = { ...hiddenKeys, [k]: !hiddenKeys[k] };
      }}
    />
  {/if}

  <div
    bind:clientWidth={containerWidth}
    class="coim-chart-container coim-bar-chart"
    role="img"
    aria-label={title ?? ariaLabel}
    style={`height: ${height}px;`}
  >
    <BarChart
      ssr
      width={chartWidth}
      {height}
      {data}
      x={xKey}
      series={layerSeries}
      seriesLayout={layout}
      {orientation}
      props={{
        bars: { stroke: "none", radius: 4 },
      }}
      grid={grid}
      axis={true}
      padding={{ top: 16, right: 16, bottom: 28, left: 40 }}
    />
  </div>
</div>
