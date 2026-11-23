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
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import { driveStore } from "#lib/apps/drive.svelte.ts";
  import DriveShell from "#lib/apps/DriveShell.svelte";

  let workspaceName = $state("");

  function handleAdd(event: SubmitEvent) {
    event.preventDefault();
    if (!workspaceName.trim()) return;
    driveStore.addWorkspace(workspaceName);
    toast.success(`Created workspace "${workspaceName.trim()}"`);
    workspaceName = "";
  }
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Workspaces</title>
</svelte:head>

<DriveShell title="Shared Workspaces" subtitle="Create shared team drives and monitor allocation limits.">
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader title="Create Team Workspace" />
      <CoimCardContent>
        <form class="flex flex-wrap items-end gap-3" onsubmit={handleAdd}>
          <div class="min-w-64 flex-1">
            <CoimTextField label="Workspace Name" placeholder="e.g. QA Automation Vault" bind:value={workspaceName} required fullWidth />
          </div>
          <CoimButton type="submit" variant="contained">Add Workspace</CoimButton>
        </form>
      </CoimCardContent>
    </CoimCard>

    <CoimGrid container spacing={4}>
      {#each driveStore.workspaces as ws (ws.id)}
        <CoimGrid size={{ xs: 12, md: 4 }}>
          <CoimCard class="h-full">
            <CoimCardHeader title={ws.name} subheader={`${ws.members} members · Role: ${ws.role}`}>
              {#snippet action()}
                <CoimChip label={`${ws.storageUsedGb}/${ws.storageLimitGb} GB`} size="small" variant="outlined" />
              {/snippet}
            </CoimCardHeader>
            <CoimCardContent>
              <CoimLinearProgress
                variant="determinate"
                value={Math.min(100, Math.round((ws.storageUsedGb / ws.storageLimitGb) * 100))}
              />
            </CoimCardContent>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>
  </CoimStack>
</DriveShell>
