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
    CoimTypography,
  } from "@coimui/svelte";
  import {
    CoimAreaChart,
    CoimBarChart,
    CoimGaugeChart,
    CoimPieChart,
    CoimSparklineChart,
  } from "@coimui/svelte/charts";
  import { CoimDataGrid, type CoimDataGridColumn } from "@coimui/svelte/data-grid";

  interface OrderRow extends Record<string, unknown> {
    id: string;
    customer: string;
    channel: string;
    amount: number;
    status: string;
  }

  const revenueSeries = [
    { month: "Jan", revenue: 42000, forecast: 39000 },
    { month: "Feb", revenue: 48500, forecast: 44000 },
    { month: "Mar", revenue: 51200, forecast: 48500 },
    { month: "Apr", revenue: 59800, forecast: 54000 },
    { month: "May", revenue: 64100, forecast: 60200 },
    { month: "Jun", revenue: 72400, forecast: 67500 },
  ];

  const categoryData = [
    { quarter: "Q1", cloud: 34, services: 19 },
    { quarter: "Q2", cloud: 41, services: 23 },
    { quarter: "Q3", cloud: 49, services: 28 },
    { quarter: "Q4", cloud: 58, services: 32 },
  ];

  const orderRows: OrderRow[] = [
    { id: "ORD-9041", customer: "Northstar Labs", channel: "Enterprise", amount: 14200, status: "Settled" },
    { id: "ORD-9042", customer: "Aurelia Retail", channel: "Self-Serve", amount: 3480, status: "Processing" },
    { id: "ORD-9043", customer: "Velox Logistics", channel: "Partner", amount: 9150, status: "Settled" },
    { id: "ORD-9044", customer: "Kestrel Bio", channel: "Enterprise", amount: 22600, status: "Pending" },
  ];

  const orderColumns: CoimDataGridColumn<OrderRow>[] = [
    { id: "id", field: "id", headerName: "Order ID", width: 120 },
    { id: "customer", field: "customer", headerName: "Account", width: 180 },
    { id: "channel", field: "channel", headerName: "Channel", width: 130 },
    { id: "status", field: "status", headerName: "Status", width: 120 },
    {
      id: "amount",
      field: "amount",
      headerName: "Amount",
      type: "number",
      align: "right",
      width: 130,
      valueFormatter: (v) => `$${Number(v ?? 0).toLocaleString()}`,
    },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Executive Overview</title>
</svelte:head>

<CoimStack spacing={6}>
  <div class="flex flex-wrap items-center justify-between gap-4">
    <div>
      <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/" }, { label: "Executive Overview" }]} />
      <CoimTypography variant="h1" class="mt-2">CoimUI v1.0.0 Showcase</CoimTypography>
      <CoimTypography variant="body1" class="text-text-secondary mt-1">
        Full-featured Svelte 5 design system, accessible components, charts, data grid, date pickers, and plugins.
      </CoimTypography>
    </div>

    <div class="flex flex-wrap gap-2">
      <CoimButton variant="outlined" href="/components">Explore Components</CoimButton>
      <CoimButton variant="contained" href="/docs">Read Docs</CoimButton>
    </div>
  </div>

  <CoimGrid container spacing={4}>
    {#each [
      { title: "Net ARR", value: "$842,900", chip: "+18.4%", spark: [28, 34, 31, 44, 49, 57, 64] },
      { title: "Active Seats", value: "14,280", chip: "+9.2%", spark: [18, 21, 23, 22, 27, 30, 34] },
      { title: "Avg Order Value", value: "$4,820", chip: "+5.1%", spark: [40, 38, 42, 45, 44, 48, 52] },
      { title: "CSAT Score", value: "96.4%", chip: "+1.8%", spark: [89, 91, 92, 93, 95, 95, 96] },
    ] as card (card.title)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard>
          <CoimCardContent>
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-text-secondary text-sm">{card.title}</div>
                <div class="font-heading mt-1 text-2xl font-bold">{card.value}</div>
                <CoimChip label={card.chip} size="small" variant="pastel" color="success" class="mt-2" />
              </div>
              <CoimSparklineChart data={card.spark} variant="area" width={100} height={44} />
            </div>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 8 }}>
      <CoimCard>
        <CoimCardHeader title="Revenue Trajectory" subheader="Actual vs target projection" />
        <CoimCardContent>
          <CoimAreaChart
            data={revenueSeries}
            xKey="month"
            series={[
              { key: "revenue", label: "Actual Revenue" },
              { key: "forecast", label: "Target Forecast" },
            ]}
            height={280}
          />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 4 }}>
      <CoimCard>
        <CoimCardHeader title="Revenue Mix" subheader="Share by acquisition channel" />
        <CoimCardContent class="flex flex-col items-center">
          <CoimPieChart
            donut
            height={240}
            data={[
              { label: "Enterprise", value: 52 },
              { label: "Self-Serve", value: 31 },
              { label: "Partner", value: 17 },
            ]}
          />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 6 }}>
      <CoimCard>
        <CoimCardHeader title="Quarterly Segment Growth" />
        <CoimCardContent>
          <CoimBarChart
            data={categoryData}
            xKey="quarter"
            layout="group"
            series={[
              { key: "cloud", label: "Cloud Suite" },
              { key: "services", label: "Advisory" },
            ]}
            height={240}
          />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 6 }}>
      <CoimCard>
        <CoimCardHeader title="Infrastructure Capacity" subheader="Real-time cluster headroom" />
        <CoimCardContent class="flex flex-wrap items-center justify-around gap-6 py-4">
          <CoimGaugeChart value={78} label="Compute Quota" />
          <CoimGaugeChart value={92} label="Cache Hit Rate" color="hsl(var(--secondary))" />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>

  <CoimDataGrid
    rows={orderRows}
    columns={orderColumns as unknown as CoimDataGridColumn[]}
    checkboxSelection
    ariaLabel="Recent executive orders"
  />
</CoimStack>
