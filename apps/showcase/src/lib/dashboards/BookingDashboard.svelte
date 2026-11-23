<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimCardMedia,
    CoimChip,
    CoimGrid,
    CoimRating,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { CoimBarChart } from "@coimui/svelte/charts";

  interface Props {
    titlesInside?: boolean;
  }

  let { titlesInside = false }: Props = $props();

  let selectedCategory = $state("All");
  const categories = ["All", "Alpine", "Coastal", "Urban"];

  const listings = [
    { id: "bk-1", title: "Koto Alpine Timber Chalet", category: "Alpine", rate: "$340 / night", rating: 4.9, occupancy: "92%", img: "/images/booking/booking-1.jpg" },
    { id: "bk-2", title: "Solstice Oceanfront Pavilion", category: "Coastal", rate: "$410 / night", rating: 4.8, occupancy: "88%", img: "/images/booking/booking-2.jpg" },
    { id: "bk-3", title: "Atrium Loft Downtown", category: "Urban", rate: "$245 / night", rating: 4.7, occupancy: "95%", img: "/images/booking/booking-3.jpg" },
  ];

  const recentBookings = [
    { id: "RES-4401", guest: "Clara Oswald", property: "Koto Alpine Timber Chalet", dates: "Dec 12 - Dec 16", total: "$1,360", status: "Confirmed" },
    { id: "RES-4402", guest: "Nolan Reid", property: "Solstice Oceanfront Pavilion", dates: "Dec 18 - Dec 22", total: "$1,640", status: "Checked In" },
    { id: "RES-4403", guest: "Mina Sato", property: "Atrium Loft Downtown", dates: "Dec 24 - Dec 27", total: "$735", status: "Pending" },
  ];

  const availabilityData = [
    { month: "Jul", booked: 84, open: 16 },
    { month: "Aug", booked: 91, open: 9 },
    { month: "Sep", booked: 78, open: 22 },
    { month: "Oct", booked: 82, open: 18 },
    { month: "Nov", booked: 89, open: 11 },
  ];

  const visibleListings = $derived(
    selectedCategory === "All"
      ? listings
      : listings.filter((l) => l.category === selectedCategory),
  );
</script>

<CoimStack spacing={5}>
  {#if titlesInside}
    <CoimCard>
      <CoimCardContent>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/dashboards" }, { label: "Booking (Titles Inside)" }]} />
            <CoimTypography variant="h1" class="mt-2">Booking &amp; Hospitality Operations</CoimTypography>
            <p class="text-text-secondary text-sm">Occupancy trends, seasonal holiday availability, and reservation queue.</p>
          </div>
          <CoimButton href="/dashboards/booking" size="small" variant="outlined">Standard Outer Header</CoimButton>
        </div>
      </CoimCardContent>
    </CoimCard>
  {:else}
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/dashboards" }, { label: "Booking" }]} />
        <CoimTypography variant="h1" class="mt-2">Booking &amp; Hospitality</CoimTypography>
        <p class="text-text-secondary mt-1">Seasonal occupancy pacing, destination inventory, and guest reservations.</p>
      </div>
      <CoimButton href="/dashboards/booking/booking-titles-inside" size="small" variant="outlined">
        Titles Inside Variant
      </CoimButton>
    </div>
  {/if}

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, sm: 4 }}>
      <CoimCard><CoimCardHeader title="Occupancy Rate" subheader="Rolling 30 days" /><CoimCardContent><p class="font-heading text-3xl font-bold">89.4%</p></CoimCardContent></CoimCard>
    </CoimGrid>
    <CoimGrid size={{ xs: 12, sm: 4 }}>
      <CoimCard><CoimCardHeader title="Avg Nightly Rate" subheader="Portfolio ADR" /><CoimCardContent><p class="font-heading text-3xl font-bold">$318</p></CoimCardContent></CoimCard>
    </CoimGrid>
    <CoimGrid size={{ xs: 12, sm: 4 }}>
      <CoimCard><CoimCardHeader title="Active Reservations" subheader="Upcoming arrivals" /><CoimCardContent><p class="font-heading text-3xl font-bold">142</p></CoimCardContent></CoimCard>
    </CoimGrid>
  </CoimGrid>

  <div class="flex flex-wrap gap-2">
    {#each categories as cat (cat)}
      <CoimButton size="small" variant={selectedCategory === cat ? "contained" : "outlined"} onclick={() => (selectedCategory = cat)}>
        {cat}
      </CoimButton>
    {/each}
  </div>

  <CoimGrid container spacing={4}>
    {#each visibleListings as stay (stay.id)}
      <CoimGrid size={{ xs: 12, md: 4 }}>
        <CoimCard class="h-full overflow-hidden">
          <CoimCardMedia component="img" image={stay.img} alt={stay.title} class="h-44 w-full object-cover" />
          <CoimCardHeader title={stay.title} subheader={`${stay.category} · ${stay.occupancy} filled`}>
            {#snippet action()}
              <CoimChip label={stay.rate} color="primary" size="small" variant="pastel" />
            {/snippet}
          </CoimCardHeader>
          <CoimCardContent>
            <div class="flex items-center justify-between gap-2">
              <CoimRating value={stay.rating} readOnly precision={0.5} size="small" />
              <CoimButton size="tiny" variant="outlined" onclick={() => toast.info(`Opened availability for ${stay.title}`)}>
                Inspect
              </CoimButton>
            </div>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 6 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Seasonal Occupancy vs Open Nights" />
        <CoimCardContent>
          <CoimBarChart
            data={availabilityData}
            xKey="month"
            layout="stack"
            series={[
              { key: "booked", label: "Booked (%)" },
              { key: "open", label: "Open (%)" },
            ]}
            height={230}
          />
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
    <CoimGrid size={{ xs: 12, lg: 6 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Recent Bookings" />
        <CoimCardContent>
          <CoimTableContainer>
            <CoimTable aria-label="Recent bookings">
              <CoimTableHead>
                <CoimTableRow>
                  <CoimTableCell component="th">Guest</CoimTableCell>
                  <CoimTableCell component="th">Dates</CoimTableCell>
                  <CoimTableCell component="th">Status</CoimTableCell>
                  <CoimTableCell component="th" align="right">Total</CoimTableCell>
                </CoimTableRow>
              </CoimTableHead>
              <CoimTableBody>
                {#each recentBookings as b (b.id)}
                  <CoimTableRow>
                    <CoimTableCell>{b.guest}</CoimTableCell>
                    <CoimTableCell>{b.dates}</CoimTableCell>
                    <CoimTableCell><CoimChip label={b.status} size="small" variant="pastel" color="info" /></CoimTableCell>
                    <CoimTableCell align="right">{b.total}</CoimTableCell>
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
