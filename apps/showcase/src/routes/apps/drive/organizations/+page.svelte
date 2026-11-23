<script lang="ts">
  import {
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
  } from "@coimui/svelte";
  import { driveStore } from "#lib/apps/drive.svelte.ts";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Organizations</title>
</svelte:head>

<DriveShell title="Connected Organizations" subtitle="Tenant domains, seat allocations, and verification state.">
  <CoimGrid container spacing={4}>
    {#each driveStore.organizations as org (org.id)}
      <CoimGrid size={{ xs: 12, md: 6 }}>
        <CoimCard class="h-full">
          <CoimCardHeader title={org.name} subheader={org.domain}>
            {#snippet action()}
              <CoimChip
                label={org.verified ? "Verified Domain" : "Pending DNS"}
                color={org.verified ? "success" : "warning"}
                size="small"
                variant="pastel"
              />
            {/snippet}
          </CoimCardHeader>
          <CoimCardContent>
            <p class="text-text-secondary text-sm">Licensed member seats: <strong class="text-text-primary">{org.seats}</strong></p>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    {/each}
  </CoimGrid>
</DriveShell>
