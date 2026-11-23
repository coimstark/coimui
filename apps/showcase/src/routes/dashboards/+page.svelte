<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimGrid,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";

  const dashboards = [
    { slug: "default", title: "Executive Overview", desc: "Revenue trajectory, revenue mix, and quarterly KPIs." },
    { slug: "analytics", title: "Analytics", desc: "Traffic funnel, capability radar, and cohort heatmap." },
    { slug: "booking", title: "Booking", desc: "Hospitality listings, seasonal occupancy, and reservations." },
    { slug: "commerce", title: "Commerce", desc: "Checkout velocity, merchandising radar, and order funnel." },
    { slug: "finance", title: "Finance", desc: "Cashflow velocity, margin targets, and regional clearing." },
    { slug: "health", title: "Health", desc: "Patient vitals, care team visits, and laboratory panels." },
    { slug: "learning", title: "Learning", desc: "Course completion velocity, skill radar, and tracks." },
    { slug: "visual", title: "Visual", desc: "Stock sparklines, editorial feed, checklist, and reviews." },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Dashboards Hub</title>
</svelte:head>

<CoimStack spacing={6}>
  <div>
    <CoimBreadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboards" }]} />
    <CoimTypography variant="h1" class="mt-2">Dashboard Variants</CoimTypography>
    <p class="text-text-secondary mt-1">
      Explore all 8 executive and vertical dashboards in both standard outer-title and titles-inside surface variants.
    </p>
  </div>

  <CoimGrid container spacing={4}>
    {#each dashboards as dash (dash.slug)}
      <CoimGrid size={{ xs: 12, sm: 6, lg: 3 }}>
        <CoimCard class="flex h-full flex-col justify-between">
          <div>
            <CoimCardHeader title={dash.title} />
            <CoimCardContent>
              <p class="text-text-secondary text-sm">{dash.desc}</p>
            </CoimCardContent>
          </div>
          <CoimCardActions>
            <CoimButton href={`/dashboards/${dash.slug}`} size="small" variant="contained">Open</CoimButton>
            <CoimButton href={`/dashboards/${dash.slug}/${dash.slug}-titles-inside`} size="small" variant="outlined">
              Titles Inside
            </CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</CoimStack>
