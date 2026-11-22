<script lang="ts">
  import { extent } from "d3-array";
  import { scaleBand, scaleLinear } from "d3-scale";
  import { cn } from "../utilities/utils.js";
  import type { CoimHeatmapCell } from "./types.js";

  interface Props {
    data: CoimHeatmapCell[];
    width?: number;
    height?: number;
    title?: string;
    ariaLabel?: string;
    class?: string;
  }

  let {
    data,
    width = 480,
    height = 240,
    title,
    ariaLabel = "Heatmap chart",
    class: className = "",
  }: Props = $props();

  let hovered = $state<CoimHeatmapCell | null>(null);
  const pad = { top: 12, right: 12, bottom: 28, left: 64 };

  const layout = $derived.by(() => {
    const xDomain = Array.from(new Set(data.map((d) => d.x)));
    const yDomain = Array.from(new Set(data.map((d) => d.y)));
    const [rawMin, rawMax] = extent(data, (d) => d.value) as [number, number];
    const min = rawMin ?? 0;
    const max = rawMax === min ? min + 1 : rawMax;

    const xScale = scaleBand().domain(xDomain).range([pad.left, width - pad.right]).padding(0.08);
    const yScale = scaleBand().domain(yDomain).range([pad.top, height - pad.bottom]).padding(0.08);
    const alphaScale = scaleLinear().domain([min, max]).range([0.15, 0.95]);

    const cells = data.map((d) => ({
      ...d,
      cx: xScale(d.x) ?? pad.left,
      cy: yScale(d.y) ?? pad.top,
      w: Math.max(4, xScale.bandwidth()),
      h: Math.max(4, yScale.bandwidth()),
      alpha: alphaScale(d.value),
    }));

    return { xDomain, yDomain, xScale, yScale, cells };
  });
</script>

<div class={cn("coim-chart-root", className)}>
  {#if title}
    <div class="font-heading text-text-primary text-base font-semibold">{title}</div>
  {/if}

  <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title ?? ariaLabel} class="w-full overflow-visible" style={`max-height: ${height}px;`}>
    {#each layout.cells as cell (`${cell.x}-${cell.y}`)}
      <rect
        role="presentation"
        x={cell.cx}
        y={cell.cy}
        width={cell.w}
        height={cell.h}
        rx={4}
        fill={`hsl(var(--primary) / ${cell.alpha.toFixed(2)})`}
        stroke={hovered === cell ? "hsl(var(--primary-dark))" : "hsl(var(--background-paper))"}
        stroke-width={hovered === cell ? 2 : 1}
        onmouseenter={() => (hovered = cell)}
        onmouseleave={() => (hovered = null)}
      >
        <title>{cell.y} / {cell.x}: {cell.value}</title>
      </rect>
    {/each}

    {#each layout.xDomain as xLabel (xLabel)}
      <text
        x={(layout.xScale(xLabel) ?? 0) + layout.xScale.bandwidth() / 2}
        y={height - 8}
        text-anchor="middle"
        class="fill-text-secondary font-body text-xs"
      >
        {xLabel}
      </text>
    {/each}

    {#each layout.yDomain as yLabel (yLabel)}
      <text
        x={pad.left - 8}
        y={(layout.yScale(yLabel) ?? 0) + layout.yScale.bandwidth() / 2}
        text-anchor="end"
        dominant-baseline="middle"
        class="fill-text-secondary font-body text-xs"
      >
        {yLabel}
      </text>
    {/each}
  </svg>

  {#if hovered}
    <div class="font-body text-text-secondary text-xs">
      {hovered.y} · {hovered.x}: <strong class="text-text-primary">{hovered.value}</strong>
    </div>
  {/if}
</div>
