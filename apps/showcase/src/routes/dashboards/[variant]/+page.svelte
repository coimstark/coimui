<script lang="ts">
  import { page } from "$app/state";
  import {
    CoimBreadcrumbs,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";
  import {
    CoimFunnelChart,
    CoimGaugeChart,
    CoimHeatmapChart,
    CoimLineChart,
    CoimRadarChart,
  } from "@coimui/svelte/charts";

  const configs: Record<string, { title: string; subtitle: string; gauge: number }> = {
    analytics: { title: "Analytics Dashboard", subtitle: "Traffic funnel, cohort activity heatmap, and engagement velocity", gauge: 84 },
    commerce: { title: "Commerce Dashboard", subtitle: "Conversion funnel, basket size metrics, and category strength", gauge: 76 },
    finance: { title: "Finance Dashboard", subtitle: "Quarterly cashflow burn rate, margin radar, and settlement velocity", gauge: 91 },
    operations: { title: "Operations Dashboard", subtitle: "Service reliability index, incident heatmap, and throughput trends", gauge: 99 },
    saas: { title: "SaaS Metrics", subtitle: "Trial-to-paid conversion funnel and net dollar retention", gauge: 88 },
    learning: { title: "Learning Portal", subtitle: "Cohort completion rates, skill competency radar, and weekly hours", gauge: 73 },
  };

  const variantKey = $derived(page.params.variant ?? "analytics");
  const meta = $derived(configs[variantKey] ?? configs.analytics);

  const weeklySeries = [
    { day: "Mon", sessions: 420, goals: 58 },
    { day: "Tue", sessions: 510, goals: 72 },
    { day: "Wed", sessions: 590, goals: 86 },
    { day: "Thu", sessions: 540, goals: 79 },
    { day: "Fri", sessions: 670, goals: 94 },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — {meta.title}</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/" }, { label: meta.title }]} />
    <CoimTypography variant="h1" class="mt-2">{meta.title}</CoimTypography>
    <p class="text-text-secondary mt-1">{meta.subtitle}</p>
  </div>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 7 }}>
      <CoimCard>
        <CoimCardHeader title="Weekly Trajectory" />
        <CoimCardContent>
          <CoimLineChart
            data={weeklySeries}
            xKey="day"
            showPoints
            series={[
              { key: "sessions", label: "Active Sessions" },
              { key: "goals", label: "Goal Completions" },
            ]}
            height={250}
          />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 5 }}>
      <CoimCard>
        <CoimCardHeader title="Target Attainment" />
        <CoimCardContent class="flex justify-center">
          <CoimGaugeChart value={meta.gauge} label="Target Index" size={200} />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, md: 6 }}>
      <CoimCard>
        <CoimCardHeader title="Acquisition Funnel" />
        <CoimCardContent>
          <CoimFunnelChart
            stages={[
              { label: "Impressions", value: 12400 },
              { label: "Qualified Leads", value: 6800 },
              { label: "Evaluations", value: 3200 },
              { label: "Closed Won", value: 1450 },
            ]}
          />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, md: 6 }}>
      <CoimCard>
        <CoimCardHeader title="Capability Radar" />
        <CoimCardContent>
          <CoimRadarChart
            axes={["Speed", "Adoption", "Reliability", "Efficiency", "Support"]}
            series={[
              { key: "current", label: "Current Quarter", values: [92, 85, 96, 82, 90] },
              { key: "baseline", label: "Baseline", values: [78, 72, 88, 75, 81] },
            ]}
          />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={12}>
      <CoimCard>
        <CoimCardHeader title="Cohort Activity Heatmap" />
        <CoimCardContent>
          <CoimHeatmapChart
            data={[
              { x: "Week 1", y: "Cohort A", value: 94 },
              { x: "Week 2", y: "Cohort A", value: 78 },
              { x: "Week 3", y: "Cohort A", value: 65 },
              { x: "Week 4", y: "Cohort A", value: 61 },
              { x: "Week 1", y: "Cohort B", value: 89 },
              { x: "Week 2", y: "Cohort B", value: 74 },
              { x: "Week 3", y: "Cohort B", value: 70 },
              { x: "Week 4", y: "Cohort B", value: 68 },
            ]}
          />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</CoimStack>
