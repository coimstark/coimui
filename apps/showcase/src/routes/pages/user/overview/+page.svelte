<script lang="ts">
  import {
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimLinearProgress,
    CoimList,
    CoimListItem,
    CoimListItemText,
    CoimStack,
  } from "@coimui/svelte";
  import { userProfileStore } from "#lib/pages/user.svelte.ts";
  import UserProfileShell from "#lib/pages/UserProfileShell.svelte";

  const logs = [
    { event: "Published DataGrid Pivot Field Configurator", time: "Today, 14:20" },
    { event: "Verified WCAG 2.1 AA across 18 routes", time: "Yesterday, 17:05" },
    { event: "Synced 5 locale dictionaries cleanly", time: "Nov 21, 2026" },
  ];
</script>

<svelte:head>
  <title>CoimUI Showcase — User Overview</title>
</svelte:head>

<UserProfileShell title="User Profile Overview" subtitle="Activity logs, active projects, contributions, and workspace metrics.">
  <CoimGrid container spacing={4}>
    <CoimGrid size={{ xs: 12, lg: 7 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Active Projects" subheader="Tracked engineering deliverables" />
        <CoimCardContent>
          <CoimStack spacing={3}>
            {#each userProfileStore.projects as proj (proj.id)}
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-sm">
                  <span class="font-medium">{proj.name}</span>
                  <CoimChip label={proj.status} size="small" variant="pastel" color={proj.status === "Completed" ? "success" : "primary"} />
                </div>
                <CoimLinearProgress variant="determinate" value={proj.progress} />
              </div>
            {/each}
          </CoimStack>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>

    <CoimGrid size={{ xs: 12, lg: 5 }}>
      <CoimCard class="h-full">
        <CoimCardHeader title="Recent Audit Activity" />
        <CoimCardContent>
          <CoimList>
            {#each logs as log (log.event)}
              <CoimListItem>
                <CoimListItemText primary={log.event} secondary={log.time} />
              </CoimListItem>
            {/each}
          </CoimList>
        </CoimCardContent>
      </CoimCard>
    </CoimGrid>
  </CoimGrid>
</UserProfileShell>
