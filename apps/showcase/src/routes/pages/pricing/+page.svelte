<script lang="ts">
  import {
    CoimBreadcrumbs,
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimList,
    CoimListItem,
    CoimListItemIcon,
    CoimListItemText,
    CoimStack,
    CoimSwitch,
    CoimTypography,
    toast,
  } from "@coimui/svelte";
  import { CiCheck } from "@coimui/svelte/icons";

  let annual = $state(true);

  const plans = [
    {
      name: "Core Open Source",
      monthly: 0,
      annual: 0,
      summary: "All core UI components, theme tokens, layouts, and forms.",
      features: ["Zero heavy transitive deps", "4 theme presets + light/dark", "Full Svelte 5 & TS 7 types"],
      highlight: false,
    },
    {
      name: "Pro Team",
      monthly: 49,
      annual: 39,
      summary: "Complete enterprise dashboards, charts, data grid exports, and plugins.",
      features: ["TanStack v9 DataGrid + XLSX", "10 LayerChart & D3 families", "Priority release advisories"],
      highlight: true,
    },
    {
      name: "Enterprise SLA",
      monthly: 149,
      annual: 119,
      summary: "Dedicated security audits, custom brand tokens, and compliance artifacts.",
      features: ["Private design token workshop", "WCAG 2.1 AA review certification", "Dedicated upgrade engineering"],
      highlight: false,
    },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Pricing Plans</title>
</svelte:head>

<CoimStack spacing={6}>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <CoimBreadcrumbs items={[{ label: "Pages", href: "/" }, { label: "Pricing" }]} />
      <CoimTypography variant="h1" class="mt-2">Licensing &amp; Support Plans</CoimTypography>
      <p class="text-text-secondary mt-1">Predictable tiers scaled for small product squads up to multi-org design systems.</p>
    </div>

    <div class="flex items-center gap-3">
      <CoimSwitch label="Annual Billing (Save 20%)" bind:checked={annual} />
    </div>
  </div>

  <CoimGrid container spacing={4}>
    {#each plans as plan (plan.name)}
      {@const price = annual ? plan.annual : plan.monthly}
      <CoimGrid size={{ xs: 12, md: 4 }}>
        <CoimCard class={plan.highlight ? "border-primary border-2 h-full" : "h-full"}>
          <CoimCardHeader title={plan.name} subheader={plan.summary}>
            {#snippet action()}
              {#if plan.highlight}
                <CoimChip label="Recommended" size="small" color="primary" variant="pastel" />
              {/if}
            {/snippet}
          </CoimCardHeader>
          <CoimCardContent>
            <div class="mb-4 flex items-baseline gap-1">
              <span class="font-heading text-3xl font-bold">${price}</span>
              <span class="text-text-secondary text-sm">/ month</span>
            </div>
            <CoimList>
              {#each plan.features as feat (feat)}
                <CoimListItem>
                  <CoimListItemIcon><CiCheck class="text-success" size={18} /></CoimListItemIcon>
                  <CoimListItemText primary={feat} />
                </CoimListItem>
              {/each}
            </CoimList>
          </CoimCardContent>
          <CoimCardActions>
            <CoimButton
              variant={plan.highlight ? "contained" : "outlined"}
              fullWidth
              onclick={() => toast.success(`Selected ${plan.name}`)}
            >
              Select {plan.name}
            </CoimButton>
          </CoimCardActions>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</CoimStack>
