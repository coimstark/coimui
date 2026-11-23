<script lang="ts">
  import { cn } from "../utilities/utils.js";
  import { getChartColor } from "./palette.js";
  import type { CoimFunnelStage } from "./types.js";

  interface Props {
    stages: CoimFunnelStage[];
    width?: number;
    height?: number;
    curve?: "linear" | "smooth";
    title?: string;
    ariaLabel?: string;
    class?: string;
  }

  let {
    stages,
    width = 500,
    height = 240,
    curve = "linear",
    title,
    ariaLabel = "Funnel chart",
    class: className = "",
  }: Props = $props();

  const bars = $derived.by(() => {
    if (stages.length === 0) return [];
    const maxVal = Math.max(1, stages[0].value, ...stages.map((s) => s.value));
    const slotH = height / stages.length;
    const cx = width / 2;
    const minWidth = width * 0.48;
    const maxWidth = width * 0.86;
    const widthFor = (val: number) => minWidth + (val / maxVal) * (maxWidth - minWidth);

    return stages.map((stage, idx) => {
      const topWidth = widthFor(stage.value);
      const nextVal = stages[idx + 1]?.value ?? stage.value * 0.72;
      const bottomWidth = Math.max(minWidth * 0.85, Math.min(topWidth, widthFor(nextVal)));
      const y1 = idx * slotH + 3;
      const y2 = (idx + 1) * slotH - 3;
      const x1L = cx - topWidth / 2;
      const x1R = cx + topWidth / 2;
      const x2R = cx + bottomWidth / 2;
      const x2L = cx - bottomWidth / 2;
      const ym = (y1 + y2) / 2;

      const points = [`${x1L},${y1}`, `${x1R},${y1}`, `${x2R},${y2}`, `${x2L},${y2}`].join(" ");
      const smoothPath = [
        `M ${x1L} ${y1}`,
        `L ${x1R} ${y1}`,
        `C ${x1R} ${ym}, ${x2R} ${ym}, ${x2R} ${y2}`,
        `L ${x2L} ${y2}`,
        `C ${x2L} ${ym}, ${x1L} ${ym}, ${x1L} ${y1}`,
        "Z",
      ].join(" ");

      const conversion = Math.round((stage.value / maxVal) * 100);
      return {
        label: stage.label,
        value: stage.value,
        conversion,
        color: getChartColor(idx, stage.color),
        points,
        smoothPath,
        cy: ym,
        cx,
      };
    });
  });
</script>

<div class={cn("coim-chart-root", className)}>
  {#if title}
    <div class="font-heading text-text-primary text-base font-semibold">{title}</div>
  {/if}

  <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title ?? ariaLabel} class="w-full" style={`max-height: ${height}px;`}>
    {#each bars as item, idx (idx)}
      {#if curve === "smooth"}
        <path
          d={item.smoothPath}
          fill={item.color}
          fill-opacity="0.14"
          stroke={item.color}
          stroke-width="2"
          stroke-linejoin="round"
        >
          <title>{item.label}: {item.value.toLocaleString()} ({item.conversion}%)</title>
        </path>
      {:else}
        <polygon
          points={item.points}
          fill={item.color}
          fill-opacity="0.14"
          stroke={item.color}
          stroke-width="2"
          stroke-linejoin="round"
        >
          <title>{item.label}: {item.value.toLocaleString()} ({item.conversion}%)</title>
        </polygon>
      {/if}
      <text
        x={item.cx}
        y={item.cy}
        text-anchor="middle"
        dominant-baseline="middle"
        fill="hsl(var(--text-primary))"
        class="font-body text-xs font-semibold"
      >
        {item.label} · {item.value.toLocaleString()} ({item.conversion}%)
      </text>
    {/each}
  </svg>
</div>
