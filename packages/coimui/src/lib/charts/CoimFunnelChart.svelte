<script lang="ts">
  import { cn } from "../utilities/utils.js";
  import { getChartColor } from "./palette.js";
  import type { CoimFunnelStage } from "./types.js";

  interface Props {
    stages: CoimFunnelStage[];
    width?: number;
    height?: number;
    title?: string;
    ariaLabel?: string;
    class?: string;
  }

  let {
    stages,
    width = 500,
    height = 240,
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
      const points = [
        `${cx - topWidth / 2},${y1}`,
        `${cx + topWidth / 2},${y1}`,
        `${cx + bottomWidth / 2},${y2}`,
        `${cx - bottomWidth / 2},${y2}`,
      ].join(" ");
      const conversion = Math.round((stage.value / maxVal) * 100);
      return {
        label: stage.label,
        value: stage.value,
        conversion,
        color: getChartColor(idx, stage.color),
        points,
        cy: (y1 + y2) / 2,
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
