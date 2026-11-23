<script lang="ts">
  import { arc } from "d3-shape";
  import { cn } from "../utilities/utils.js";

  interface Props {
    value: number;
    min?: number;
    max?: number;
    startAngle?: number;
    endAngle?: number;
    size?: number;
    thickness?: number;
    color?: string;
    label?: string;
    unit?: string;
    showPointer?: boolean;
    ariaLabel?: string;
    class?: string;
  }

  let {
    value,
    min = 0,
    max = 100,
    startAngle = -110,
    endAngle = 110,
    size = 180,
    thickness = 14,
    color = "hsl(var(--primary))",
    label,
    unit = "%",
    showPointer = false,
    ariaLabel = "Gauge chart",
    class: className = "",
  }: Props = $props();

  const ratio = $derived.by(() => {
    const span = max - min;
    if (span <= 0) return 0;
    return Math.min(1, Math.max(0, (value - min) / span));
  });

  const paths = $derived.by(() => {
    const outerR = size / 2 - 8;
    const innerR = Math.max(8, outerR - thickness);
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const startRad = toRad(startAngle);
    const endRad = toRad(endAngle);
    const valRad = startRad + (endRad - startRad) * ratio;

    const trackGen = arc<unknown>()
      .innerRadius(innerR)
      .outerRadius(outerR)
      .cornerRadius(thickness / 2)
      .startAngle(startRad)
      .endAngle(endRad);

    const valGen = arc<unknown>()
      .innerRadius(innerR)
      .outerRadius(outerR)
      .cornerRadius(thickness / 2)
      .startAngle(startRad)
      .endAngle(valRad);

    const pointerLen = Math.max(16, innerR - 6);
    const px = pointerLen * Math.sin(valRad);
    const py = -pointerLen * Math.cos(valRad);
    const bx1 = 3.5 * Math.cos(valRad);
    const by1 = 3.5 * Math.sin(valRad);

    return {
      track: trackGen({}) ?? "",
      valueArc: valGen({}) ?? "",
      pointerPoints: `${px},${py} ${bx1},${by1} ${-bx1},${-by1}`,
    };
  });
</script>

<div class={cn("coim-gauge-chart inline-flex flex-col items-center", className)}>
  <svg
    viewBox={`0 0 ${size} ${size}`}
    width={size}
    height={size}
    role="meter"
    aria-label={label ?? ariaLabel}
    aria-valuenow={value}
    aria-valuemin={min}
    aria-valuemax={max}
  >
    <g transform={`translate(${size / 2}, ${size / 2})`}>
      <path d={paths.track} fill="hsl(var(--grey-100))" />
      {#if ratio > 0}
        <path d={paths.valueArc} fill={color} />
      {/if}
      {#if showPointer}
        <polygon points={paths.pointerPoints} fill={color} data-testid="gauge-pointer" />
        <circle cx="0" cy="0" r="5" fill="hsl(var(--text-primary))" />
      {/if}
    </g>
    <text
      x={size / 2}
      y={showPointer ? size / 2 + 30 : size / 2 + 4}
      text-anchor="middle"
      class="fill-text-primary font-heading text-2xl font-bold"
    >
      {Math.round(value)}{unit}
    </text>
    {#if label}
      <text
        x={size / 2}
        y={showPointer ? size / 2 + 48 : size / 2 + 24}
        text-anchor="middle"
        class="fill-text-secondary font-body text-xs"
      >
        {label}
      </text>
    {/if}
  </svg>
</div>
