<script lang="ts">
  import { Arc, PieChart } from "layerchart";
  import { cn } from "../utilities/utils.js";
  import CoimChartLegend from "./CoimChartLegend.svelte";
  import { getChartColor } from "./palette.js";
  import type { CoimPieDatum } from "./types.js";

  interface Props {
    data: CoimPieDatum[];
    donut?: boolean;
    innerRadius?: number;
    cornerRadius?: number;
    padAngle?: number;
    labels?: boolean;
    height?: number;
    showLegend?: boolean;
    title?: string;
    ariaLabel?: string;
    class?: string;
  }

  let {
    data,
    donut = false,
    innerRadius,
    cornerRadius = 4,
    padAngle = 0.02,
    labels = false,
    height = 280,
    showLegend = true,
    title,
    ariaLabel = "Pie chart",
    class: className = "",
  }: Props = $props();

  let hiddenKeys = $state<Record<string, boolean>>({});
  let containerWidth = $state(0);
  const chartWidth = $derived(containerWidth > 0 ? Math.max(220, Math.floor(containerWidth)) : 400);

  const normalized = $derived(
    data.map((d, idx) => ({
      key: d.key ?? d.label,
      label: d.label,
      value: d.value,
      color: getChartColor(idx, d.color),
    })),
  );

  const visibleData = $derived(normalized.filter((d) => !hiddenKeys[d.key]));
  const legendItems = $derived(
    normalized.map((d) => ({
      key: d.key,
      label: d.label,
      color: d.color,
      visible: !hiddenKeys[d.key],
    })),
  );
  const resolvedInnerRadius = $derived(innerRadius ?? (donut ? 0.62 : 0));
</script>

{#snippet customArc({ props: arcProps }: { props: Record<string, unknown> })}
  <Arc
    {...arcProps}
    fillOpacity={0.14}
    stroke={typeof arcProps.fill === "string" ? arcProps.fill : "currentColor"}
    strokeWidth={2}
  />
{/snippet}

<div class={cn("coim-chart-root", className)}>
  {#if title}
    <div class="font-heading text-text-primary text-base font-semibold">{title}</div>
  {/if}

  {#if showLegend}
    <CoimChartLegend
      items={legendItems}
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
    <PieChart
      ssr
      width={chartWidth}
      {height}
      data={visibleData}
      key="key"
      label="label"
      value="value"
      cRange={visibleData.map((d) => d.color)}
      innerRadius={resolvedInnerRadius}
      {cornerRadius}
      {padAngle}
      {labels}
      arc={labels ? undefined : (customArc as never)}
    />
  </div>
</div>
