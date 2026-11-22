<script lang="ts">
  import { CoimBreadcrumbs, CoimGrid, CoimStack, CoimTypography } from "@coimui/svelte";
  import {
    CoimAreaChart,
    CoimBarChart,
    CoimFunnelChart,
    CoimGaugeChart,
    CoimHeatmapChart,
    CoimLineChart,
    CoimPieChart,
    CoimRadarChart,
    CoimScatterChart,
    CoimSparklineChart,
  } from "@coimui/svelte/charts";
  import ComponentDocCard from "#lib/components/ComponentDocCard.svelte";
  import { COMPONENT_CODE_EXAMPLES } from "#lib/examples/component-docs.ts";

  const barData = [
    { quarter: "Q1", cloud: 44, platform: 28 },
    { quarter: "Q2", cloud: 52, platform: 34 },
    { quarter: "Q3", cloud: 61, platform: 41 },
    { quarter: "Q4", cloud: 75, platform: 49 },
  ];

  const trendData = [
    { month: "Jan", arr: 180, goal: 165 },
    { month: "Feb", arr: 204, goal: 185 },
    { month: "Mar", arr: 228, goal: 210 },
    { month: "Apr", arr: 256, goal: 235 },
    { month: "May", arr: 289, goal: 260 },
    { month: "Jun", arr: 318, goal: 290 },
  ];

  const mixData = [
    { key: "enterprise", label: "Enterprise", value: 52 },
    { key: "growth", label: "Growth", value: 31 },
    { key: "starter", label: "Starter", value: 17 },
  ];

  const scatterData = [
    { x: 12, y: 42, series: "APAC" },
    { x: 24, y: 65, series: "APAC" },
    { x: 35, y: 78, series: "EU" },
    { x: 48, y: 84, series: "EU" },
    { x: 52, y: 92, series: "NA" },
  ];

  const heatmapData = [
    { x: "Mon", y: "Morning", value: 42 },
    { x: "Tue", y: "Morning", value: 58 },
    { x: "Wed", y: "Morning", value: 74 },
    { x: "Thu", y: "Morning", value: 65 },
    { x: "Mon", y: "Afternoon", value: 81 },
    { x: "Tue", y: "Afternoon", value: 92 },
    { x: "Wed", y: "Afternoon", value: 88 },
    { x: "Thu", y: "Afternoon", value: 79 },
  ];

  const funnelStages = [
    { label: "Visitors", value: 12400 },
    { label: "Trials", value: 4800 },
    { label: "Active Teams", value: 2150 },
    { label: "Enterprise", value: 890 },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Charts</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Charts" }]} />
    <CoimTypography variant="h1" class="mt-2">Charts &amp; Data Visualization</CoimTypography>
    <p class="text-text-secondary mt-1">
      Ten responsive SVG chart components powered by LayerChart and D3 with shared palette tokens and accessible titles.
    </p>
  </div>

  <CoimTypography variant="h2">Core &amp; Specialized Chart Families</CoimTypography>

  <ComponentDocCard
    title="Bar, Line, Area & Pie Charts"
    description="Cartesian and proportional series backed by LayerChart with interactive legends."
    packageEntry="@coimui/svelte/charts"
    code={COMPONENT_CODE_EXAMPLES.charts}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, lg: 6 }}>
        <CoimBarChart
          title="Quarterly Revenue Mix"
          data={barData}
          xKey="quarter"
          series={[
            { key: "cloud", label: "Cloud" },
            { key: "platform", label: "Platform" },
          ]}
        />
      </CoimGrid>
      <CoimGrid size={{ xs: 12, lg: 6 }}>
        <CoimLineChart
          title="ARR vs Target"
          data={trendData}
          xKey="month"
          series={[
            { key: "arr", label: "Actual ARR" },
            { key: "goal", label: "Target" },
          ]}
        />
      </CoimGrid>
      <CoimGrid size={{ xs: 12, lg: 7 }}>
        <CoimAreaChart
          title="Cumulative Expansion"
          data={trendData}
          xKey="month"
          stacked
          series={[
            { key: "arr", label: "Expansion" },
            { key: "goal", label: "Baseline" },
          ]}
        />
      </CoimGrid>
      <CoimGrid size={{ xs: 12, lg: 5 }}>
        <CoimPieChart title="Plan Breakdown" data={mixData} donut />
      </CoimGrid>
    </CoimGrid>
  </ComponentDocCard>

  <ComponentDocCard
    title="Scatter, Sparklines, Gauge, Radar, Heatmap & Funnel"
    description="Telemetry KPI gauges, compact sparklines, correlation plots, cohort matrices, and conversion funnels."
    packageEntry="@coimui/svelte/charts"
    code={COMPONENT_CODE_EXAMPLES.charts}
  >
    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimScatterChart title="Latency vs Throughput" data={scatterData} />
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <div class="flex flex-col items-center justify-center gap-4 py-4">
          <CoimGaugeChart value={84} label="SLA Adherence" />
          <div class="flex flex-wrap items-center justify-center gap-6">
            <CoimSparklineChart data={[12, 18, 15, 24, 31, 29, 38]} variant="area" ariaLabel="Weekly signup sparkline" />
            <CoimSparklineChart data={[10, 14, 19, 17, 25, 30, 28]} variant="bar" ariaLabel="Daily builds sparkline" />
          </div>
        </div>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimRadarChart
          title="Capability Benchmark"
          axes={["Perf", "A11y", "DX", "Themes", "SSR"]}
          series={[
            { key: "v1", label: "CoimUI v1.0", values: [94, 98, 92, 95, 97] },
            { key: "baseline", label: "Baseline", values: [72, 75, 70, 68, 74] },
          ]}
        />
      </CoimGrid>
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimHeatmapChart title="Session Density Heatmap" data={heatmapData} width={440} height={220} />
      </CoimGrid>
      <CoimGrid size={12}>
        <CoimFunnelChart title="Activation Funnel" stages={funnelStages} width={520} height={220} />
      </CoimGrid>
    </CoimGrid>
  </ComponentDocCard>
</CoimStack>
