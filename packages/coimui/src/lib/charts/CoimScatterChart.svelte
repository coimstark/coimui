<script lang="ts">
  import { Points, ScatterChart } from "layerchart";
  import { extent } from "d3-array";
  import { scaleLinear } from "d3-scale";
  import { cn } from "../utilities/utils.js";
  import CoimChartLegend from "./CoimChartLegend.svelte";
  import { getChartColor } from "./palette.js";
  import type { CoimScatterDatum } from "./types.js";

  interface Props {
    data: CoimScatterDatum[];
    height?: number;
    grid?: boolean;
    secondaryYAxis?: boolean;
    showLegend?: boolean;
    title?: string;
    ariaLabel?: string;
    class?: string;
  }

  let {
    data,
    height = 280,
    grid = true,
    secondaryYAxis = false,
    showLegend = true,
    title,
    ariaLabel = "Scatter chart",
    class: className = "",
  }: Props = $props();

  let containerWidth = $state(0);
  let hiddenKeys = $state<Record<string, boolean>>({});
  let hoveredDatum = $state<CoimScatterDatum | null>(null);
  const chartWidth = $derived(containerWidth > 0 ? Math.max(240, Math.floor(containerWidth)) : 600);
  const hasSecondaryAxis = $derived(secondaryYAxis || data.some((d) => d.yAxis === "right"));

  const groupedSeries = $derived.by(() => {
    const names = Array.from(new Set(data.map((d) => d.series ?? "Series")));
    return names.map((name, idx) => ({
      key: name,
      label: name,
      data: data.filter((d) => (d.series ?? "Series") === name),
      color: getChartColor(idx),
    }));
  });

  const dualLayout = $derived.by(() => {
    if (!hasSecondaryAxis) return null;
    const pad = { top: 16, right: 44, bottom: 28, left: 44 };
    const visiblePoints = data.filter((d) => !hiddenKeys[d.series ?? "Series"]);
    const [rawMinX, rawMaxX] = extent(visiblePoints, (d) => d.x) as [number, number];
    const leftPts = visiblePoints.filter((d) => d.yAxis !== "right");
    const rightPts = visiblePoints.filter((d) => d.yAxis === "right");
    const [rawMinL, rawMaxL] = extent(leftPts.length ? leftPts : visiblePoints, (d) => d.y) as [number, number];
    const [rawMinR, rawMaxR] = extent(rightPts.length ? rightPts : visiblePoints, (d) => d.y) as [number, number];

    const minX = rawMinX ?? 0;
    const maxX = rawMaxX === minX ? minX + 1 : rawMaxX ?? 10;
    const minL = rawMinL ?? 0;
    const maxL = rawMaxL === minL ? minL + 1 : rawMaxL ?? 10;
    const minR = rawMinR ?? 0;
    const maxR = rawMaxR === minR ? minR + 1 : rawMaxR ?? 10;

    const xScale = scaleLinear().domain([minX, maxX]).nice().range([pad.left, chartWidth - pad.right]);
    const yLeftScale = scaleLinear().domain([minL, maxL]).nice().range([height - pad.bottom, pad.top]);
    const yRightScale = scaleLinear().domain([minR, maxR]).nice().range([height - pad.bottom, pad.top]);

    const seriesColors = new Map(groupedSeries.map((s) => [s.key, s.color]));
    const plotted = visiblePoints.map((d) => ({
      datum: d,
      cx: xScale(d.x),
      cy: d.yAxis === "right" ? yRightScale(d.y) : yLeftScale(d.y),
      r: d.r ?? 5,
      color: seriesColors.get(d.series ?? "Series") ?? getChartColor(0),
    }));

    return {
      pad,
      plotted,
      xTicks: xScale.ticks(5).map((t) => ({ pos: xScale(t), label: String(t) })),
      leftTicks: yLeftScale.ticks(4).map((t) => ({ pos: yLeftScale(t), label: String(t) })),
      rightTicks: yRightScale.ticks(4).map((t) => ({ pos: yRightScale(t), label: String(t) })),
    };
  });
</script>

<div class={cn("coim-chart-root", className)}>
  {#if title}
    <div class="font-heading text-text-primary text-base font-semibold">{title}</div>
  {/if}

  {#if hasSecondaryAxis && showLegend && groupedSeries.length > 1}
    <CoimChartLegend
      items={groupedSeries.map((s) => ({
        key: s.key,
        label: s.label,
        color: s.color,
        visible: !hiddenKeys[s.key],
      }))}
      onToggle={(k) => {
        hiddenKeys = { ...hiddenKeys, [k]: !hiddenKeys[k] };
      }}
    />
  {/if}

  <div
    bind:clientWidth={containerWidth}
    class="coim-chart-container"
    role="img"
    aria-label={title ?? ariaLabel}
    style={`height: ${height}px;`}
  >
    {#if hasSecondaryAxis && dualLayout}
      <svg viewBox={`0 0 ${chartWidth} ${height}`} class="h-full w-full overflow-visible">
        {#if grid}
          {#each dualLayout.leftTicks as tick (tick.label)}
            <line
              x1={dualLayout.pad.left}
              y1={tick.pos}
              x2={chartWidth - dualLayout.pad.right}
              y2={tick.pos}
              stroke="hsl(var(--grey-100))"
              stroke-dasharray="3 3"
            />
          {/each}
        {/if}

        {#each dualLayout.plotted as pt, idx (`pt-${idx}`)}
          <circle
            role="presentation"
            cx={pt.cx}
            cy={pt.cy}
            r={pt.r}
            fill={pt.color}
            fill-opacity="0.2"
            stroke={pt.color}
            stroke-width="2"
            onmouseenter={() => (hoveredDatum = pt.datum)}
            onmouseleave={() => (hoveredDatum = null)}
          >
            <title>{pt.datum.series ?? "Point"} ({pt.datum.yAxis === "right" ? "Right axis" : "Left axis"}): ({pt.datum.x}, {pt.datum.y})</title>
          </circle>
        {/each}

        {#each dualLayout.xTicks as tick (tick.label)}
          <text x={tick.pos} y={height - 8} text-anchor="middle" class="fill-text-secondary font-body text-xs">
            {tick.label}
          </text>
        {/each}
        {#each dualLayout.leftTicks as tick (tick.label)}
          <text x={dualLayout.pad.left - 8} y={tick.pos} text-anchor="end" dominant-baseline="middle" class="fill-text-secondary font-body text-xs">
            {tick.label}
          </text>
        {/each}
        {#each dualLayout.rightTicks as tick (tick.label)}
          <text
            x={chartWidth - dualLayout.pad.right + 8}
            y={tick.pos}
            text-anchor="start"
            dominant-baseline="middle"
            class="fill-secondary font-body text-xs"
            data-axis="right"
          >
            {tick.label}
          </text>
        {/each}
      </svg>
    {:else}
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
    {/if}
  </div>

  {#if hoveredDatum}
    <div class="font-body text-text-secondary text-xs">
      {hoveredDatum.series ?? "Point"}: x={hoveredDatum.x}, y={hoveredDatum.y}
    </div>
  {/if}
</div>
