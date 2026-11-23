<script lang="ts" generics="TData extends Record<string, unknown> = Record<string, unknown>">
  import { BarChart } from "layerchart";
  import { scaleBand, scaleLinear } from "d3-scale";
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
  let hoveredRangeLabel = $state<string | null>(null);
  const chartWidth = $derived(containerWidth > 0 ? Math.max(240, Math.floor(containerWidth)) : 600);
  const isRangeChart = $derived(series.some((s) => Boolean(s.minKey && s.maxKey)));

  const legendItems = $derived(
    series.map((s, idx) => ({
      key: s.key,
      label: s.label ?? s.key,
      color: getChartColor(idx, s.color),
      visible: !hiddenKeys[s.key],
    })),
  );

  const layerSeries = $derived(
    series.map((s, idx) => {
      const color = getChartColor(idx, s.color);
      return {
        key: s.key,
        label: s.label ?? s.key,
        value: (row: TData) => Number(s.valueAccessor ? s.valueAccessor(row) : row[s.valueKey ?? s.key] ?? 0),
        color,
        selected: !hiddenKeys[s.key],
        props: { stroke: color, strokeWidth: 2, fillOpacity: 0.14 },
      };
    }),
  );

  const rangeLayout = $derived.by(() => {
    if (!isRangeChart) return null;
    const pad = { top: 16, right: 16, bottom: 28, left: 44 };
    const visibleSeries = series
      .map((s, idx) => ({ s, idx, color: getChartColor(idx, s.color) }))
      .filter((entry) => !hiddenKeys[entry.s.key]);

    const vals: number[] = [];
    for (const row of data) {
      for (const { s } of visibleSeries) {
        if (s.minKey && s.maxKey) {
          vals.push(Number(row[s.minKey] ?? 0), Number(row[s.maxKey] ?? 0));
        }
      }
    }
    const rawMin = vals.length ? Math.min(0, ...vals) : 0;
    const rawMax = vals.length ? Math.max(1, ...vals) : 100;
    const categories = data.map((row) => String(row[xKey] ?? ""));

    if (orientation === "horizontal") {
      const yScale = scaleBand().domain(categories).range([pad.top, height - pad.bottom]).padding(0.24);
      const xScale = scaleLinear().domain([rawMin, rawMax]).nice().range([pad.left, chartWidth - pad.right]);
      const bandStep = visibleSeries.length > 0 ? yScale.bandwidth() / visibleSeries.length : yScale.bandwidth();
      const rects = data.flatMap((row) => {
        const cat = String(row[xKey] ?? "");
        const baseY = yScale(cat) ?? pad.top;
        return visibleSeries.map(({ s, color }, si) => {
          const minV = s.minKey ? Number(row[s.minKey] ?? 0) : 0;
          const maxV = s.maxKey ? Number(row[s.maxKey] ?? 0) : minV;
          const xStart = xScale(Math.min(minV, maxV));
          const xEnd = xScale(Math.max(minV, maxV));
          return {
            key: `${cat}-${s.key}`,
            label: `${cat} · ${s.label ?? s.key}: ${minV}–${maxV}`,
            x: xStart,
            y: baseY + si * bandStep,
            w: Math.max(4, xEnd - xStart),
            h: Math.max(6, bandStep - 2),
            color,
          };
        });
      });
      return {
        rects,
        ticks: xScale.ticks(4).map((t) => ({ pos: xScale(t), label: String(t) })),
        categories: categories.map((c) => ({ pos: (yScale(c) ?? 0) + yScale.bandwidth() / 2, label: c })),
        pad,
      };
    }

    const xScale = scaleBand().domain(categories).range([pad.left, chartWidth - pad.right]).padding(0.24);
    const yScale = scaleLinear().domain([rawMin, rawMax]).nice().range([height - pad.bottom, pad.top]);
    const bandStep = visibleSeries.length > 0 ? xScale.bandwidth() / visibleSeries.length : xScale.bandwidth();
    const rects = data.flatMap((row) => {
      const cat = String(row[xKey] ?? "");
      const baseX = xScale(cat) ?? pad.left;
      return visibleSeries.map(({ s, color }, si) => {
        const minV = s.minKey ? Number(row[s.minKey] ?? 0) : 0;
        const maxV = s.maxKey ? Number(row[s.maxKey] ?? 0) : minV;
        const yTop = yScale(Math.max(minV, maxV));
        const yBottom = yScale(Math.min(minV, maxV));
        return {
          key: `${cat}-${s.key}`,
          label: `${cat} · ${s.label ?? s.key}: ${minV}–${maxV}`,
          x: baseX + si * bandStep,
          y: yTop,
          w: Math.max(6, bandStep - 2),
          h: Math.max(4, yBottom - yTop),
          color,
        };
      });
    });
    return {
      rects,
      ticks: yScale.ticks(4).map((t) => ({ pos: yScale(t), label: String(t) })),
      categories: categories.map((c) => ({ pos: (xScale(c) ?? 0) + xScale.bandwidth() / 2, label: c })),
      pad,
    };
  });
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
    {#if isRangeChart && rangeLayout}
      <svg viewBox={`0 0 ${chartWidth} ${height}`} class="h-full w-full overflow-visible">
        {#if grid}
          {#each rangeLayout.ticks as t (t.label)}
            {#if orientation === "horizontal"}
              <line
                x1={t.pos}
                y1={rangeLayout.pad.top}
                x2={t.pos}
                y2={height - rangeLayout.pad.bottom}
                stroke="hsl(var(--grey-100))"
                stroke-dasharray="3 3"
              />
            {:else}
              <line
                x1={rangeLayout.pad.left}
                y1={t.pos}
                x2={chartWidth - rangeLayout.pad.right}
                y2={t.pos}
                stroke="hsl(var(--grey-100))"
                stroke-dasharray="3 3"
              />
            {/if}
          {/each}
        {/if}

        {#each rangeLayout.rects as bar (bar.key)}
          <rect
            role="presentation"
            x={bar.x}
            y={bar.y}
            width={bar.w}
            height={bar.h}
            rx={6}
            fill={bar.color}
            fill-opacity="0.14"
            stroke={bar.color}
            stroke-width="2"
            onmouseenter={() => (hoveredRangeLabel = bar.label)}
            onmouseleave={() => (hoveredRangeLabel = null)}
          >
            <title>{bar.label}</title>
          </rect>
        {/each}

        {#each rangeLayout.ticks as t (t.label)}
          {#if orientation === "horizontal"}
            <text x={t.pos} y={height - 8} text-anchor="middle" class="fill-text-secondary font-body text-xs">
              {t.label}
            </text>
          {:else}
            <text x={rangeLayout.pad.left - 8} y={t.pos} text-anchor="end" dominant-baseline="middle" class="fill-text-secondary font-body text-xs">
              {t.label}
            </text>
          {/if}
        {/each}

        {#each rangeLayout.categories as c (c.label)}
          {#if orientation === "horizontal"}
            <text x={rangeLayout.pad.left - 8} y={c.pos} text-anchor="end" dominant-baseline="middle" class="fill-text-secondary font-body text-xs">
              {c.label}
            </text>
          {:else}
            <text x={c.pos} y={height - 8} text-anchor="middle" class="fill-text-secondary font-body text-xs">
              {c.label}
            </text>
          {/if}
        {/each}
      </svg>
    {:else}
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
          bars: { radius: 8, strokeWidth: 2, fillOpacity: 0.14 },
        }}
        grid={grid}
        axis={true}
        padding={{ top: 16, right: 16, bottom: 28, left: 40 }}
      />
    {/if}
  </div>
  {#if hoveredRangeLabel}
    <div class="font-body text-text-secondary text-xs">{hoveredRangeLabel}</div>
  {/if}
</div>
