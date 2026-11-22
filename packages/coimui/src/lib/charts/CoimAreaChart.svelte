<script lang="ts" generics="TData extends Record<string, unknown> = Record<string, unknown>">
  import { AreaChart } from "layerchart";
  import { curveLinear, curveMonotoneX } from "d3-shape";
  import { cn } from "../utilities/utils.js";
  import CoimChartLegend from "./CoimChartLegend.svelte";
  import { getChartColor } from "./palette.js";
  import type { CoimAreaChartProps } from "./types.js";

  type Props = CoimAreaChartProps<TData>;

  let {
    data,
    xKey,
    series,
    stacked = false,
    curve = "smooth",
    height = 280,
    showLegend = true,
    grid = true,
    title,
    ariaLabel = "Area chart",
    class: className = "",
  }: Props = $props();

  let hiddenKeys = $state<Record<string, boolean>>({});

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

  <div class="coim-chart-container" role="img" aria-label={title ?? ariaLabel} style={`height: ${height}px;`}>
    <AreaChart
      ssr
      width={600}
      {height}
      {data}
      x={xKey}
      series={layerSeries}
      seriesLayout={stacked ? "stack" : "overlap"}
      props={{
        area: { curve: curve === "smooth" ? curveMonotoneX : curveLinear },
      }}
      {grid}
      axis={true}
      padding={{ top: 16, right: 16, bottom: 28, left: 40 }}
    />
  </div>
</div>
