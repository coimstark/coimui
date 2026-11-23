<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimLinearProgress,
    CoimStack,
  } from "@coimui/svelte";
  import { userProfileStore } from "#lib/pages/user.svelte.ts";
  import UserProfileShell from "#lib/pages/UserProfileShell.svelte";

  let statusFilter = $state<"All" | "Active" | "Completed" | "Planned">("All");
  const visible = $derived(
    statusFilter === "All"
      ? userProfileStore.projects
      : userProfileStore.projects.filter((p) => p.status === statusFilter),
  );
</script>

<svelte:head>
  <title>CoimUI Showcase — User Projects</title>
</svelte:head>

<UserProfileShell title="Assigned Projects" subtitle="Filter deliverables by lifecycle stage.">
  <CoimStack spacing={4}>
    <div class="flex flex-wrap gap-2">
      {#each (["All", "Active", "Completed", "Planned"] as const) as st (st)}
        <CoimButton size="small" variant={statusFilter === st ? "contained" : "outlined"} onclick={() => (statusFilter = st)}>
          {st}
        </CoimButton>
      {/each}
    </div>

    <CoimGrid container spacing={4}>
      {#each visible as proj (proj.id)}
        <CoimGrid size={{ xs: 12, md: 6 }}>
          <CoimCard class="h-full">
            <CoimCardHeader title={proj.name} subheader={`Role: ${proj.role} · Updated ${proj.updated}`}>
              {#snippet action()}
                <CoimChip label={proj.status} color={proj.status === "Completed" ? "success" : "primary"} size="small" variant="pastel" />
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <CoimLinearProgress variant="determinate" value={proj.progress} />
              <p class="text-text-secondary mt-2 text-xs">{proj.progress}% completed</p>
            </CoimCardContent>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>
  </CoimStack>
</UserProfileShell>
