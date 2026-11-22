<script lang="ts">
  import { extent } from "d3-array";
  import { scaleLinear } from "d3-scale";
  import { area, curveLinear, curveMonotoneX, line } from "d3-shape";
  import { cn } from "../utilities/utils.js";

  interface Props {
    data: number[];
    variant?: "line" | "area" | "bar";
    curve?: "linear" | "smooth";
    color?: string;
    width?: number;
    height?: number;
    showHighlight?: boolean;
    ariaLabel?: string;
    class?: string;
  }

  let {
    data,
    variant = "line",
    curve = "smooth",
    color = "hsl(var(--primary))",
    width = 160,
    height = 48,
    showHighlight = true,
    ariaLabel = "Sparkline chart",
    class: className = "",
  }: Props = $props();

  let hoverIndex = $state<number | null>(null);
  const pad = 4;

  const computed = $derived.by(() => {
    if (data.length === 0) {
      return { linePath: "", areaPath: "", bars: [], points: [] as Array<{ x: number; y: number; value: number }> };
    }
    const [rawMin, rawMax] = extent(data) as [number, number];
    const min = rawMin ?? 0;
    const max = rawMax === min ? min + 1 : rawMax;

    const xScale = scaleLinear()
      .domain([0, Math.max(1, data.length - 1)])
      .range([pad, width - pad]);
    const yScale = scaleLinear()
      .domain([min, max])
      .range([height - pad, pad]);

    const curveFn = curve === "smooth" ? curveMonotoneX : curveLinear;
    const points = data.map((v, idx) => ({ x: xScale(idx), y: yScale(v), value: v }));

    const lineGen = line<{ x: number; y: number }>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveFn);
    const areaGen = area<{ x: number; y: number }>()
      .x((d) => d.x)
      .y0(height - pad)
      .y1((d) => d.y)
      .curve(curveFn);

    const barWidth = Math.max(2, (width - pad * 2) / Math.max(1, data.length) - 2);
    const bars = data.map((v, idx) => {
      const y = yScale(v);
      return {
        x: pad + idx * ((width - pad * 2) / Math.max(1, data.length)),
        y,
        width: barWidth,
        height: Math.max(2, height - pad - y),
        value: v,
      };
    });

    return {
      linePath: lineGen(points) ?? "",
      areaPath: areaGen(points) ?? "",
      bars,
      points,
    };
  });
</script>

<div class={cn("coim-sparkline inline-flex flex-col gap-1", className)}>
  <svg
    viewBox={`0 0 ${width} ${height}`}
    {width}
    {height}
    role="img"
    aria-label={ariaLabel}
    class="overflow-visible"
  >
    {#if variant === "bar"}
      {#each computed.bars as bar, idx (idx)}
        <rect
          role="presentation"
          x={bar.x}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          rx={2}
          fill={color}
          opacity={hoverIndex === null || hoverIndex === idx ? 0.9 : 0.45}
          onmouseenter={() => (hoverIndex = idx)}
          onmouseleave={() => (hoverIndex = null)}
        >
          <title>{bar.value}</title>
        </rect>
      {/each}
    {:else}
      {#if variant === "area" && computed.areaPath}
        <path d={computed.areaPath} fill={color} fill-opacity="0.16" />
      {/if}
      {#if computed.linePath}
        <path d={computed.linePath} fill="none" stroke={color} stroke-width="2" stroke-linecap="round" />
      {/if}
      {#if showHighlight}
        {#each computed.points as pt, idx (idx)}
          <circle
            role="presentation"
            cx={pt.x}
            cy={pt.y}
            r={hoverIndex === idx ? 4 : 2.5}
            fill={color}
            opacity={hoverIndex === idx ? 1 : 0}
            onmouseenter={() => (hoverIndex = idx)}
            onmouseleave={() => (hoverIndex = null)}
          >
            <title>{pt.value}</title>
          </circle>
        {/each}
      {/if}
    {/if}
  </svg>
  {#if hoverIndex !== null && data[hoverIndex] !== undefined}
    <span class="font-body text-text-secondary text-xs">Value: {data[hoverIndex]}</span>
  {/if}
</div>
