<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimStack,
    CoimToggleButton,
    CoimToggleButtonGroup,
    CoimTypography,
  } from "@coimui/svelte";
  import {
    CoimAreaChart,
    CoimFunnelChart,
    CoimGaugeChart,
    CoimHeatmapChart,
    CoimLineChart,
    CoimPieChart,
    CoimRadarChart,
  } from "@coimui/svelte/charts";
  import BookingDashboard from "./BookingDashboard.svelte";
  import HealthDashboard from "./HealthDashboard.svelte";
  import VisualDashboard from "./VisualDashboard.svelte";

  interface Props {
    variant: string;
    titlesInside?: boolean;
  }

  let { variant, titlesInside = false }: Props = $props();

  interface DashboardConfig {
    title: string;
    subtitle: string;
    gauge: number;
    gaugeLabel: string;
    primaryLabel: string;
    secondaryLabel: string;
    baseSeries: { day: string; sessions: number; goals: number }[];
    funnel: { label: string; value: number }[];
    radarAxes: string[];
    radarCurrent: number[];
    radarBaseline: number[];
    heatmap: { x: string; y: string; value: number }[];
  }

  const configs: Record<string, DashboardConfig> = {
    default: {
      title: "Executive Overview",
      subtitle: "Primary workspace KPIs, revenue trajectory, channel distribution, and attainment",
      gauge: 92,
      gaugeLabel: "Quarterly Goal",
      primaryLabel: "Revenue ($k)",
      secondaryLabel: "New Orders",
      baseSeries: [
        { day: "Jan", sessions: 420, goals: 64 },
        { day: "Feb", sessions: 485, goals: 72 },
        { day: "Mar", sessions: 512, goals: 81 },
        { day: "Apr", sessions: 598, goals: 94 },
        { day: "May", sessions: 641, goals: 108 },
      ],
      funnel: [
        { label: "Visitors", value: 18400 },
        { label: "Trials", value: 7600 },
        { label: "Qualified", value: 3900 },
        { label: "Closed", value: 1940 },
      ],
      radarAxes: ["Growth", "Margins", "Retention", "CSAT", "Velocity"],
      radarCurrent: [92, 87, 94, 96, 89],
      radarBaseline: [80, 78, 84, 88, 76],
      heatmap: [
        { x: "Week 1", y: "Enterprise", value: 95 },
        { x: "Week 2", y: "Enterprise", value: 91 },
        { x: "Week 3", y: "Enterprise", value: 89 },
        { x: "Week 4", y: "Enterprise", value: 93 },
      ],
    },
    analytics: {
      title: "Analytics Dashboard",
      subtitle: "Traffic funnel, cohort activity heatmap, and engagement velocity",
      gauge: 84,
      gaugeLabel: "Goal Velocity",
      primaryLabel: "Active Sessions",
      secondaryLabel: "Goal Completions",
      baseSeries: [
        { day: "Mon", sessions: 420, goals: 58 },
        { day: "Tue", sessions: 510, goals: 72 },
        { day: "Wed", sessions: 590, goals: 86 },
        { day: "Thu", sessions: 540, goals: 79 },
        { day: "Fri", sessions: 670, goals: 94 },
      ],
      funnel: [
        { label: "Impressions", value: 12400 },
        { label: "Qualified Leads", value: 6800 },
        { label: "Evaluations", value: 3200 },
        { label: "Closed Won", value: 1450 },
      ],
      radarAxes: ["Speed", "Adoption", "Retention", "Efficiency", "Support"],
      radarCurrent: [92, 85, 89, 82, 90],
      radarBaseline: [78, 72, 74, 75, 81],
      heatmap: [
        { x: "Week 1", y: "Enterprise", value: 94 },
        { x: "Week 2", y: "Enterprise", value: 86 },
        { x: "Week 3", y: "Enterprise", value: 78 },
        { x: "Week 4", y: "Enterprise", value: 74 },
        { x: "Week 1", y: "Growth", value: 89 },
        { x: "Week 2", y: "Growth", value: 74 },
        { x: "Week 3", y: "Growth", value: 70 },
        { x: "Week 4", y: "Growth", value: 68 },
      ],
    },
    commerce: {
      title: "Commerce Dashboard",
      subtitle: "Checkout conversion funnel, order cadence, and category momentum",
      gauge: 76,
      gaugeLabel: "Fulfillment SLA",
      primaryLabel: "Cart Sessions",
      secondaryLabel: "Completed Orders",
      baseSeries: [
        { day: "Mon", sessions: 880, goals: 190 },
        { day: "Tue", sessions: 940, goals: 215 },
        { day: "Wed", sessions: 1020, goals: 248 },
        { day: "Thu", sessions: 1180, goals: 284 },
        { day: "Fri", sessions: 1320, goals: 332 },
      ],
      funnel: [
        { label: "Product Views", value: 24800 },
        { label: "Add to Cart", value: 9200 },
        { label: "Checkout", value: 4950 },
        { label: "Paid Orders", value: 3180 },
      ],
      radarAxes: ["Merchandising", "Logistics", "AOV", "Repeat Buy", "Margin"],
      radarCurrent: [88, 91, 84, 79, 86],
      radarBaseline: [75, 80, 74, 69, 77],
      heatmap: [
        { x: "Week 1", y: "Hardware", value: 91 },
        { x: "Week 2", y: "Hardware", value: 84 },
        { x: "Week 3", y: "Hardware", value: 79 },
        { x: "Week 4", y: "Hardware", value: 82 },
        { x: "Week 1", y: "Accessories", value: 76 },
        { x: "Week 2", y: "Accessories", value: 81 },
        { x: "Week 3", y: "Accessories", value: 88 },
        { x: "Week 4", y: "Accessories", value: 90 },
      ],
    },
    finance: {
      title: "Finance Dashboard",
      subtitle: "Operating cashflow trajectory, margin efficiency, and settlement velocity",
      gauge: 91,
      gaugeLabel: "Gross Margin",
      primaryLabel: "Inflows ($k)",
      secondaryLabel: "Disbursements ($k)",
      baseSeries: [
        { day: "Mon", sessions: 145, goals: 92 },
        { day: "Tue", sessions: 168, goals: 104 },
        { day: "Wed", sessions: 192, goals: 110 },
        { day: "Thu", sessions: 176, goals: 98 },
        { day: "Fri", sessions: 224, goals: 126 },
      ],
      funnel: [
        { label: "Gross Billed", value: 18500 },
        { label: "Cleared", value: 16200 },
        { label: "Settled", value: 14800 },
        { label: "Net Retained", value: 11400 },
      ],
      radarAxes: ["Liquidity", "Margin", "Collectability", "Controls", "Forecast"],
      radarCurrent: [94, 91, 88, 96, 89],
      radarBaseline: [84, 81, 79, 90, 76],
      heatmap: [
        { x: "Week 1", y: "APAC", value: 96 },
        { x: "Week 2", y: "APAC", value: 92 },
        { x: "Week 3", y: "APAC", value: 94 },
        { x: "Week 4", y: "APAC", value: 95 },
        { x: "Week 1", y: "EU", value: 88 },
        { x: "Week 2", y: "EU", value: 90 },
        { x: "Week 3", y: "EU", value: 85 },
        { x: "Week 4", y: "EU", value: 91 },
      ],
    },
    operations: {
      title: "Operations Dashboard",
      subtitle: "Service availability index, cluster throughput, and incident containment",
      gauge: 99,
      gaugeLabel: "Uptime Index",
      primaryLabel: "Requests (k/m)",
      secondaryLabel: "Alerts Triaged",
      baseSeries: [
        { day: "Mon", sessions: 620, goals: 12 },
        { day: "Tue", sessions: 645, goals: 9 },
        { day: "Wed", sessions: 690, goals: 14 },
        { day: "Thu", sessions: 710, goals: 7 },
        { day: "Fri", sessions: 685, goals: 5 },
      ],
      funnel: [
        { label: "Signals Ingested", value: 9800 },
        { label: "Deduplicated", value: 2400 },
        { label: "Actionable", value: 640 },
        { label: "Escalated", value: 180 },
      ],
      radarAxes: ["Availability", "Latency", "Failover", "Coverage", "Recovery"],
      radarCurrent: [99, 95, 93, 91, 96],
      radarBaseline: [95, 86, 84, 82, 88],
      heatmap: [
        { x: "Week 1", y: "Edge APAC", value: 99 },
        { x: "Week 2", y: "Edge APAC", value: 98 },
        { x: "Week 3", y: "Edge APAC", value: 99 },
        { x: "Week 4", y: "Edge APAC", value: 99 },
      ],
    },
    saas: {
      title: "SaaS Metrics",
      subtitle: "Trial-to-paid expansion funnel, net dollar retention, and seat growth",
      gauge: 88,
      gaugeLabel: "Net Retention",
      primaryLabel: "Active Seats",
      secondaryLabel: "Upgraded Orgs",
      baseSeries: [
        { day: "Mon", sessions: 310, goals: 28 },
        { day: "Tue", sessions: 342, goals: 35 },
        { day: "Wed", sessions: 389, goals: 41 },
        { day: "Thu", sessions: 412, goals: 44 },
        { day: "Fri", sessions: 458, goals: 53 },
      ],
      funnel: [
        { label: "Signups", value: 8400 },
        { label: "Workspace Active", value: 5100 },
        { label: "Team Invited", value: 2850 },
        { label: "Annual Paid", value: 1620 },
      ],
      radarAxes: ["Activation", "Expansion", "NPS", "Churn Control", "Security"],
      radarCurrent: [90, 88, 86, 92, 95],
      radarBaseline: [79, 74, 75, 83, 88],
      heatmap: [
        { x: "Week 1", y: "Pro Tier", value: 95 },
        { x: "Week 2", y: "Pro Tier", value: 90 },
        { x: "Week 3", y: "Pro Tier", value: 87 },
        { x: "Week 4", y: "Pro Tier", value: 85 },
      ],
    },
    learning: {
      title: "Learning Portal",
      subtitle: "Cohort track completion, skill mastery radar, and weekly study hours",
      gauge: 73,
      gaugeLabel: "Completion Rate",
      primaryLabel: "Active Learners",
      secondaryLabel: "Modules Finished",
      baseSeries: [
        { day: "Mon", sessions: 260, goals: 42 },
        { day: "Tue", sessions: 295, goals: 51 },
        { day: "Wed", sessions: 318, goals: 64 },
        { day: "Thu", sessions: 340, goals: 72 },
        { day: "Fri", sessions: 312, goals: 68 },
      ],
      funnel: [
        { label: "Enrolled", value: 6200 },
        { label: "Started Track", value: 4480 },
        { label: "Passed Labs", value: 2940 },
        { label: "Certified", value: 1860 },
      ],
      radarAxes: ["Svelte 5", "A11y", "Design Tokens", "DataGrid", "Testing"],
      radarCurrent: [93, 96, 89, 85, 91],
      radarBaseline: [74, 70, 72, 68, 75],
      heatmap: [
        { x: "Week 1", y: "Foundations", value: 92 },
        { x: "Week 2", y: "Foundations", value: 88 },
        { x: "Week 3", y: "Foundations", value: 83 },
        { x: "Week 4", y: "Foundations", value: 79 },
      ],
    },
  };

  let timeframe = $state<"7d" | "30d" | "90d">("30d");
  const timeframeFactor = $derived(timeframe === "7d" ? 0.85 : timeframe === "90d" ? 1.35 : 1);
  const meta = $derived(configs[variant] ?? configs.analytics);

  const weeklySeries = $derived(
    meta.baseSeries.map((pt) => ({
      day: pt.day,
      sessions: Math.round(pt.sessions * timeframeFactor),
      goals: Math.round(pt.goals * timeframeFactor),
    })),
  );
  const scaledFunnel = $derived(
    meta.funnel.map((s) => ({
      label: s.label,
      value: Math.round(s.value * timeframeFactor),
    })),
  );
  const scaledGauge = $derived(
    Math.min(100, Math.round(meta.gauge * (timeframe === "90d" ? 1.03 : timeframe === "7d" ? 0.96 : 1))),
  );
</script>

{#if variant === "booking"}
  <BookingDashboard {titlesInside} />
{:else if variant === "health"}
  <HealthDashboard {titlesInside} />
{:else if variant === "visual"}
  <VisualDashboard {titlesInside} />
{:else}
  <CoimStack spacing={6}>
    {#if titlesInside}
      <CoimCard>
        <CoimCardContent>
          <div class="flex flex-wrap items-end justify-between gap-4">
            <div>
              <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/dashboards" }, { label: `${meta.title} (Titles Inside)` }]} />
              <div class="mt-2 flex flex-wrap items-center gap-3">
                <CoimTypography variant="h1">{meta.title}</CoimTypography>
                <CoimChip label="Titles Inside" size="small" color="primary" variant="pastel" />
              </div>
              <p class="text-text-secondary mt-1">{meta.subtitle}</p>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <CoimButton href={`/dashboards/${variant}`} size="small" variant="outlined">
                Outer Header
              </CoimButton>
            </div>
          </div>
        </CoimCardContent>
      </CoimCard>
    {:else}
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/dashboards" }, { label: meta.title }]} />
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <CoimTypography variant="h1">{meta.title}</CoimTypography>
            <CoimChip label={`${timeframe.toUpperCase()} Window`} size="small" color="primary" variant="pastel" />
          </div>
          <p class="text-text-secondary mt-1">{meta.subtitle}</p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          {#if ["default", "analytics", "commerce", "finance", "learning"].includes(variant)}
            <CoimButton
              href={`/dashboards/${variant}/${variant}-titles-inside`}
              size="small"
              variant="outlined"
            >
              Titles Inside Variant
            </CoimButton>
          {/if}
          <CoimToggleButtonGroup
            type="single"
            value={timeframe}
            onValueChange={(next) => {
              if (next === "7d" || next === "30d" || next === "90d") timeframe = next;
            }}
            color="primary"
            size="small"
            aria-label="Timeframe window"
          >
            <CoimToggleButton value="7d">7D</CoimToggleButton>
            <CoimToggleButton value="30d">30D</CoimToggleButton>
            <CoimToggleButton value="90d">90D</CoimToggleButton>
          </CoimToggleButtonGroup>
        </div>
      </div>
    {/if}

    <CoimGrid container spacing={4}>
      <CoimGrid size={{ xs: 12, lg: 7 }}>
        <CoimCard>
          <CoimCardHeader title="Period Trajectory" subheader={`Showing ${timeframe.toUpperCase()} window`} />
          <CoimCardContent>
            {#if variant === "default"}
              <CoimAreaChart
                data={weeklySeries}
                xKey="day"
                series={[
                  { key: "sessions", label: meta.primaryLabel },
                  { key: "goals", label: meta.secondaryLabel },
                ]}
                height={250}
              />
            {:else}
              <CoimLineChart
                data={weeklySeries}
                xKey="day"
                showPoints
                series={[
                  { key: "sessions", label: meta.primaryLabel },
                  { key: "goals", label: meta.secondaryLabel },
                ]}
                height={250}
              />
            {/if}
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>

      <CoimGrid size={{ xs: 12, lg: 5 }}>
        <CoimCard>
          <CoimCardHeader title="Target Attainment" />
          <CoimCardContent class="flex justify-center">
            <CoimGaugeChart value={scaledGauge} label={meta.gaugeLabel} size={200} />
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimCard>
          <CoimCardHeader title="Conversion Funnel" />
          <CoimCardContent>
            <CoimFunnelChart stages={scaledFunnel} />
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>

      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimCard>
          <CoimCardHeader title={variant === "default" ? "Channel Mix" : "Capability Radar"} />
          <CoimCardContent>
            {#if variant === "default"}
              <CoimPieChart
                donut
                height={230}
                data={[
                  { label: "Enterprise", value: 52 },
                  { label: "Self-Serve", value: 31 },
                  { label: "Partner", value: 17 },
                ]}
              />
            {:else}
              <CoimRadarChart
                axes={meta.radarAxes}
                series={[
                  { key: "current", label: "Current Period", values: meta.radarCurrent },
                  { key: "baseline", label: "Baseline", values: meta.radarBaseline },
                ]}
              />
            {/if}
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>

      <CoimGrid size={12}>
        <CoimCard>
          <CoimCardHeader title="Cohort Activity Heatmap" />
          <CoimCardContent>
            <CoimHeatmapChart data={meta.heatmap} />
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    </CoimGrid>
  </CoimStack>
{/if}
