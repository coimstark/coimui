<script lang="ts">
  import {
    CoimAvatar,
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimList,
    CoimListItem,
    CoimListItemText,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTypography,
  } from "@coimui/svelte";
  import { CoimLineChart } from "@coimui/svelte/charts";

  interface Props {
    titlesInside?: boolean;
  }

  let { titlesInside = false }: Props = $props();

  const vitalsSeries = [
    { day: "Mon", heartRate: 68, systolic: 118 },
    { day: "Tue", heartRate: 71, systolic: 120 },
    { day: "Wed", heartRate: 66, systolic: 116 },
    { day: "Thu", heartRate: 69, systolic: 119 },
    { day: "Fri", heartRate: 67, systolic: 117 },
  ];

  const doctors = [
    { name: "Dr. Elena Vance", specialty: "Cardiology", avatar: "/images/avatars/avatar-1.jpg", slot: "09:30 Tomorrow" },
    { name: "Dr.Marcus Lin", specialty: "Preventive Lab", avatar: "/images/avatars/avatar-2.jpg", slot: "Nov 28, 14:00" },
  ];

  const labResults = [
    { test: "Complete Blood Panel", result: "Within Range", updated: "Nov 19, 2026", status: "Normal" },
    { test: "Lipid Profile", result: "LDL 84 mg/dL", updated: "Nov 14, 2026", status: "Optimal" },
    { test: "Vitamin D3", result: "38 ng/mL", updated: "Nov 02, 2026", status: "Normal" },
  ];
</script>

<CoimStack spacing={5}>
  {#if titlesInside}
    <CoimCard>
      <CoimCardContent>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/dashboards" }, { label: "Health (Titles Inside)" }]} />
            <CoimTypography variant="h1" class="mt-2">Patient Health &amp; Care Summary</CoimTypography>
            <p class="text-text-secondary text-sm">Daily vitals, specialist care team, upcoming visits, and diagnostic panels.</p>
          </div>
          <CoimButton href="/dashboards/health" size="small" variant="outlined">Standard Outer Header</CoimButton>
        </div>
      </CoimCardContent>
    </CoimCard>
  {:else}
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/dashboards" }, { label: "Health" }]} />
        <CoimTypography variant="h1" class="mt-2">Health Telemetry &amp; Care</CoimTypography>
        <p class="text-text-secondary mt-1">Vitals trends, physician schedules, diagnostic results, and patient profile.</p>
      </div>
      <CoimButton href="/dashboards/health/health-titles-inside" size="small" variant="outlined">
        Titles Inside Variant
      </CoimButton>
    </div>
  {/if}

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, sm: 4 }}>
      <CoimCard><CoimCardHeader title="Resting Heart Rate" subheader="5-day average" /><CoimCardContent><p class="font-heading text-3xl font-bold">68 bpm</p></CoimCardContent></CoimCard>
    </CoimGrid>
    <CoimGrid size={{ xs: 12, sm: 4 }}>
      <CoimCard><CoimCardHeader title="Blood Pressure" subheader="Morning reading" /><CoimCardContent><p class="font-heading text-3xl font-bold">118 / 76</p></CoimCardContent></CoimCard>
    </CoimGrid>
    <CoimGrid size={{ xs: 12, sm: 4 }}>
      <CoimCard><CoimCardHeader title="Next Appointment" subheader="Cardiology check-in" /><CoimCardContent><p class="font-heading text-xl font-bold">Tomorrow · 09:30</p></CoimCardContent></CoimCard>
    </CoimGrid>
  </CoimGrid>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 7 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Vitals Trajectory" subheader="Resting heart rate and systolic trends" />
        <CoimCardContent>
          <CoimLineChart
            data={vitalsSeries}
            xKey="day"
            showPoints
            series={[
              { key: "heartRate", label: "Heart Rate (bpm)" },
              { key: "systolic", label: "Systolic (mmHg)" },
            ]}
            height={230}
          />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 5 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Care Team &amp; Upcoming Visits" />
        <CoimCardContent>
          <CoimList>
            {#each doctors as doc (doc.name)}
              <CoimListItem>
                <CoimAvatar src={doc.avatar} alt={doc.name} size="medium" class="me-3" />
                <CoimListItemText primary={doc.name} secondary={`${doc.specialty} · ${doc.slot}`} />
              </CoimListItem>
            {/each}
          </CoimList>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={12}>
      <CoimCard>
        <CoimCardHeader title="Recent Laboratory Panels" />
        <CoimCardContent>
          <CoimTableContainer>
            <CoimTable aria-label="Laboratory results">
              <CoimTableHead>
                <CoimTableRow>
                  <CoimTableCell component="th">Panel</CoimTableCell>
                  <CoimTableCell component="th">Finding</CoimTableCell>
                  <CoimTableCell component="th">Recorded</CoimTableCell>
                  <CoimTableCell component="th">Status</CoimTableCell>
                </CoimTableRow>
              </CoimTableHead>
              <CoimTableBody>
                {#each labResults as row (row.test)}
                  <CoimTableRow>
                    <CoimTableCell>{row.test}</CoimTableCell>
                    <CoimTableCell>{row.result}</CoimTableCell>
                    <CoimTableCell>{row.updated}</CoimTableCell>
                    <CoimTableCell><CoimChip label={row.status} color="success" size="small" variant="pastel" /></CoimTableCell>
                  </CoimTableRow>
                {/each}
              </CoimTableBody>
            </CoimTable>
          </CoimTableContainer>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</CoimStack>
