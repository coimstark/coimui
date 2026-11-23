<script lang="ts">
  import {
    CoimAccordion,
    CoimAccordionDetails,
    CoimAccordionGroup,
    CoimAccordionSummary,
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimStack,
    toast,
  } from "@coimui/svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";

  const storagePlans = [
    { name: "Personal 50 GB", price: "$0 / mo", notes: "Folder sharing, stars & 30-day trash retention", featured: false },
    { name: "Workspace 2 TB", price: "$18 / mo", notes: "Shared team drives, granular labels & audit retention", featured: true },
    { name: "Organization Unlimited", price: "$49 / mo", notes: "Domain verification, legal hold & unlimited workspaces", featured: false },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Plans</title>
</svelte:head>

<DriveShell title="Drive Storage Plans" subtitle="Expand workspace quotas and team compliance controls.">
  <CoimStack spacing={4}>
    <CoimGrid container spacing={4}>
      {#each storagePlans as plan (plan.name)}
        <CoimGrid size={{ xs: 12, md: 4 }}>
          <CoimCard class={plan.featured ? "border-primary border-2 h-full" : "h-full"}>
            <CoimCardHeader title={plan.name} subheader={plan.notes}>
              {#snippet action()}
                {#if plan.featured}
                  <CoimChip label="Team Pick" color="primary" size="small" variant="pastel" />
                {/if}
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <p class="font-heading text-2xl font-bold">{plan.price}</p>
            </CoimCardContent>
            <CoimCardActions>
              <CoimButton
                fullWidth
                variant={plan.featured ? "contained" : "outlined"}
                onclick={() => toast.success(`Selected ${plan.name}`)}
              >
                Select Storage Tier
              </CoimButton>
            </CoimCardActions>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>

    <CoimAccordionGroup type="single" value="drv-q1" variant="bordered">
      <CoimAccordion value="drv-q1">
        <CoimAccordionSummary>How long do trashed items remain recoverable?</CoimAccordionSummary>
        <CoimAccordionDetails>
          Items moved to Trash remain recoverable with the Restore button until you choose Delete Forever.
        </CoimAccordionDetails>
      </CoimAccordion>
    </CoimAccordionGroup>
  </CoimStack>
</DriveShell>
