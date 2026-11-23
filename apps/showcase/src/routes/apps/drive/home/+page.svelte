<script lang="ts">
  import {
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimGrid,
    CoimStack,
  } from "@coimui/svelte";
  import { driveStore } from "#lib/apps/drive.svelte.ts";
  import DriveBrowserView from "#lib/apps/DriveBrowserView.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";

  const activeItems = $derived(driveStore.items.filter((i) => !i.trashed && !i.spam));
  const starredCount = $derived(activeItems.filter((i) => i.starred).length);
  const foldersCount = $derived(activeItems.filter((i) => i.kind === "folder").length);
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Home</title>
</svelte:head>

<DriveShell
  title="Drive Home"
  subtitle="Favorites summary, recent folders, recent files, and live workspace quota metrics."
>
  <CoimStack spacing={4}>
    <CoimGrid container spacing={3}>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimCard>
          <CoimCardHeader title="Active Files" />
          <CoimCardContent>
            <div class="flex items-center justify-between">
              <span class="font-heading text-2xl font-bold">{activeItems.length}</span>
              <CoimChip label="Synced" size="small" color="success" variant="pastel" />
            </div>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimCard>
          <CoimCardHeader title="Folders" />
          <CoimCardContent>
            <div class="flex items-center justify-between">
              <span class="font-heading text-2xl font-bold">{foldersCount}</span>
              <CoimChip label="Directories" size="small" color="primary" variant="pastel" />
            </div>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
      <CoimGrid size={{ xs: 12, sm: 4 }}>
        <CoimCard>
          <CoimCardHeader title="Starred Items" />
          <CoimCardContent>
            <div class="flex items-center justify-between">
              <span class="font-heading text-2xl font-bold">{starredCount}</span>
              <CoimChip label="Quick Access" size="small" color="warning" variant="pastel" />
            </div>
          </CoimCardContent>
        </CoimCard>
      </CoimGrid>
    </CoimGrid>

    <DriveBrowserView filterMode="all" />
  </CoimStack>
</DriveShell>
