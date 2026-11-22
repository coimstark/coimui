<script lang="ts" generics="TData extends Record<string, unknown> = Record<string, unknown>">
  import { LineChart } from "layerchart";
  import { curveLinear, curveMonotoneX } from "d3-shape";
  import { cn } from "../utilities/utils.js";
  import CoimChartLegend from "./CoimChartLegend.svelte";
  import { getChartColor } from "./palette.js";
  import type { CoimLineChartProps } from "./types.js";

  type Props = CoimLineChartProps<TData>;

  let {
    data,
    xKey,
    series,
    curve = "smooth",
    showPoints = false,
    height = 280,
    showLegend = true,
    grid = true,
    title,
    ariaLabel = "Line chart",
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
    <LineChart
      ssr
      width={600}
      {height}
      {data}
      x={xKey}
      series={layerSeries}
      points={showPoints}
      props={{
        spline: { curve: curve === "smooth" ? curveMonotoneX : curveLinear },
      }}
      {grid}
      axis={true}
      padding={{ top: 16, right: 16, bottom: 28, left: 40 }}
    />
  </div>
</div>
