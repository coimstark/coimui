<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimCardMedia,
    CoimCheckbox,
    CoimChip,
    CoimFormControlLabel,
    CoimGrid,
    CoimRating,
    CoimStack,
    CoimTypography,
  } from "@coimui/svelte";
  import { CoimSparklineChart } from "@coimui/svelte/charts";

  interface Props {
    titlesInside?: boolean;
  }

  let { titlesInside = false }: Props = $props();

  let tasks = $state([
    { id: "vt-1", label: "Review high-contrast dark card tokens", done: true },
    { id: "vt-2", label: "Approve quarterly product photography kit", done: false },
    { id: "vt-3", label: "Publish showcase accessibility verification report", done: false },
  ]);

  const stocks = [
    { symbol: "COIM", price: "$148.20", delta: "+4.2%", points: [120, 126, 129, 134, 141, 148] },
    { symbol: "SVLT", price: "$92.80", delta: "+2.8%", points: [81, 83, 85, 84, 89, 93] },
    { symbol: "DSGN", price: "$64.10", delta: "-0.6%", points: [67, 66, 65, 66, 65, 64] },
  ];

  const reviews = [
    { author: "Laura Ellis", item: "CoimDataGrid Pivot", rating: 5, text: "Clean aggregation grouping and keyboard controls." },
    { author: "Sora Park", item: "Theme Presets", rating: 5, text: "Purple, Blue, Green, and Orange stay balanced in dark mode." },
  ];
</script>

<CoimStack spacing={5}>
  {#if titlesInside}
    <CoimCard>
      <CoimCardContent>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/dashboards" }, { label: "Visual (Titles Inside)" }]} />
            <CoimTypography variant="h1" class="mt-2">Visual Studio &amp; Mixed Feed</CoimTypography>
            <p class="text-text-secondary text-sm">Sparkline tickers, editorial cards, tasks, customer ratings, and ticket pulse.</p>
          </div>
          <CoimButton href="/dashboards/visual" size="small" variant="outlined">Standard Outer Header</CoimButton>
        </div>
      </CoimCardContent>
    </CoimCard>
  {:else}
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <CoimBreadcrumbs items={[{ label: "Dashboards", href: "/dashboards" }, { label: "Visual" }]} />
        <CoimTypography variant="h1" class="mt-2">Visual &amp; Mixed Overview</CoimTypography>
        <p class="text-text-secondary mt-1">KPI sparklines, editorial media preview, task checklist, and support activity.</p>
      </div>
      <CoimButton href="/dashboards/visual/visual-titles-inside" size="small" variant="outlined">
        Titles Inside Variant
      </CoimButton>
    </div>
  {/if}

  <CoimGrid container spacing={4}>
    {#each stocks as item (item.symbol)}
      <CoimGrid size={{ xs: 12, md: 4 }}>
        <CoimCard class="h-full">
          <CoimCardContent class="flex items-center justify-between gap-3">
            <div>
              <span class="text-text-secondary text-xs font-semibold">{item.symbol}</span>
              <p class="font-heading text-2xl font-bold">{item.price}</p>
              <CoimChip
                label={item.delta}
                size="small"
                color={item.delta.startsWith("+") ? "success" : "warning"}
                variant="pastel"
                class="mt-1"
              />
            </div>
            <CoimSparklineChart data={item.points} variant="area" width={110} height={48} />
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>

  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 5 }}>
      <CoimCard class="h-full overflow-hidden">
        <CoimCardMedia component="img" image="/images/products/product-4.jpg" alt="Featured design kit" class="h-44 w-full object-cover" />
        <CoimCardHeader title="Featured Release Note" subheader="Modular Svelte 5 Design Kit" />
        <CoimCardContent>
          <p class="text-text-secondary text-sm">
            Zero runtime dependencies outside core SvelteKit &amp; modular optional engines.
          </p>
          <div class="mt-3 flex gap-2">
            <CoimButton href="/pages/miscellaneous/knowledge-base" size="small" variant="contained">
              Help Guides
            </CoimButton>
            <CoimButton href="/pages/support/issues" size="small" variant="outlined">
              Open Tickets
            </CoimButton>
          </div>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 7 }}>
      <CoimStack spacing={4}>
        <CoimCard>
          <CoimCardHeader title="Team Checklist" subheader={`${tasks.filter((t) => t.done).length}/${tasks.length} completed`} />
          <CoimCardContent>
            <CoimStack spacing={1}>
              {#each tasks as task (task.id)}
                <CoimFormControlLabel label={task.label}>
                  <CoimCheckbox bind:checked={task.done} />
                </CoimFormControlLabel>
              {/each}
            </CoimStack>
          </CoimCardContent>
        </CoimCard>

        <CoimCard>
          <CoimCardHeader title="Recent Reviews" />
          <CoimCardContent>
            <CoimStack spacing={3}>
              {#each reviews as r (r.item)}
                <div class="border-grey-100 rounded-lg border p-3">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <span class="font-semibold text-sm">{r.author} · {r.item}</span>
                    <CoimRating value={r.rating} readOnly size="small" />
                  </div>
                  <p class="text-text-secondary mt-1 text-sm">{r.text}</p>
                </div>
              {/each}
            </CoimStack>
          </CoimCardContent>
        </CoimCard>
      </CoimStack>
    </CoimGrid>
  </CoimGrid>
</CoimStack>
