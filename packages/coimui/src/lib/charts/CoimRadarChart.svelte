<script lang="ts">
  import { scaleLinear } from "d3-scale";
  import { cn } from "../utilities/utils.js";
  import CoimChartLegend from "./CoimChartLegend.svelte";
  import { getChartColor } from "./palette.js";
  import type { CoimRadarSeries } from "./types.js";

  interface Props {
    axes: string[];
    series: CoimRadarSeries[];
    maxValue?: number;
    levels?: number;
    size?: number;
    showLegend?: boolean;
    title?: string;
    ariaLabel?: string;
    class?: string;
  }

  let {
    axes,
    series,
    maxValue,
    levels = 4,
    size = 280,
    showLegend = true,
    title,
    ariaLabel = "Radar chart",
    class: className = "",
  }: Props = $props();

  let hiddenKeys = $state<Record<string, boolean>>({});

  const legendItems = $derived(
    series.map((s, idx) => ({
      key: s.key,
      label: s.label,
      color: getChartColor(idx, s.color),
      visible: !hiddenKeys[s.key],
    })),
  );

  const geometry = $derived.by(() => {
    const cx = size / 2;
    const cy = size / 2;
    const radius = Math.max(40, size / 2 - 42);
    const maxVal =
      maxValue ??
      Math.max(
        1,
        ...series.flatMap((s) => s.values),
      );
    const rScale = scaleLinear().domain([0, maxVal]).range([0, radius]);
    const angleStep = axes.length > 0 ? (Math.PI * 2) / axes.length : Math.PI / 2;

    const ringPolygons = Array.from({ length: levels }, (_, lvlIdx) => {
      const r = ((lvlIdx + 1) / levels) * radius;
      return axes
        .map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        })
        .join(" ");
    });

    const axisLines = axes.map((axisLabel, i) => {
      const angle = i * angleStep - Math.PI / 2;
      return {
        label: axisLabel,
        x2: cx + radius * Math.cos(angle),
        y2: cy + radius * Math.sin(angle),
        lx: cx + (radius + 18) * Math.cos(angle),
        ly: cy + (radius + 18) * Math.sin(angle),
      };
    });

    const polygons = series
      .filter((s) => !hiddenKeys[s.key])
      .map((s, idx) => {
        const pts = axes.map((_, i) => {
          const val = s.values[i] ?? 0;
          const r = rScale(val);
          const angle = i * angleStep - Math.PI / 2;
          return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
            value: val,
          };
        });
        return {
          key: s.key,
          label: s.label,
          color: getChartColor(idx, s.color),
          pointsAttr: pts.map((p) => `${p.x},${p.y}`).join(" "),
          dots: pts,
        };
      });

    return { cx, cy, ringPolygons, axisLines, polygons };
  });
</script>

<div class={cn("coim-chart-root items-center", className)}>
  {#if title}
    <div class="font-heading text-text-primary self-start text-base font-semibold">{title}</div>
  {/if}

  {#if showLegend && series.length > 0}
    <CoimChartLegend
      items={legendItems}
      onToggle={(k) => {
        hiddenKeys = { ...hiddenKeys, [k]: !hiddenKeys[k] };
      }}
    />
  {/if}

  <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={title ?? ariaLabel} class="overflow-visible">
    {#each geometry.ringPolygons as ring, i (i)}
      <polygon points={ring} fill="none" stroke="hsl(var(--grey-100))" stroke-width="1" />
    {/each}

    {#each geometry.axisLines as axis (axis.label)}
      <line
        x1={geometry.cx}
        y1={geometry.cy}
        x2={axis.x2}
        y2={axis.y2}
        stroke="hsl(var(--grey-100))"
        stroke-width="1"
      />
      <text
        x={axis.lx}
        y={axis.ly}
        text-anchor="middle"
        dominant-baseline="middle"
        class="fill-text-secondary font-body text-xs"
      >
        {axis.label}
      </text>
    {/each}

    {#each geometry.polygons as poly (poly.key)}
      <polygon
        points={poly.pointsAttr}
        fill={poly.color}
        fill-opacity="0.14"
        stroke={poly.color}
        stroke-width="2"
      />
      {#each poly.dots as dot, di (di)}
        <circle cx={dot.x} cy={dot.y} r="3.5" fill={poly.color}>
          <title>{poly.label}: {dot.value}</title>
        </circle>
      {/each}
    {/each}
  </svg>
</div>
