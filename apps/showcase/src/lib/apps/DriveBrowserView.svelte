<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    CoimButton,
    CoimCard,
    CoimCardActions,
    CoimCardContent,
    CoimCardHeader,
    CoimChip,
    CoimDialog,
    CoimDialogActions,
    CoimDialogContent,
    CoimDialogTitle,
    CoimDropzone,
    CoimGrid,
    CoimPaper,
    CoimStack,
    CoimTable,
    CoimTableBody,
    CoimTableCell,
    CoimTableContainer,
    CoimTableHead,
    CoimTableRow,
    CoimTextField,
    toast,
  } from "@coimui/svelte";
  import {
    CiBinEmpty,
    CiDocumentFull,
    CiDocumentImage,
    CiDocumentVideo,
    CiFolder,
    CiFolderPlus,
    CiRefresh,
    CiShare,
    CiStar,
  } from "@coimui/svelte/icons";
  import { CoimLightbox } from "@coimui/svelte/plugins";
  import { driveStore, type DriveItem } from "./drive.svelte.ts";

  interface Props {
    filterMode: "all" | "folder" | "favorites" | "shared" | "label" | "spam" | "trash";
    initialLabel?: string;
  }

  let { filterMode, initialLabel = "" }: Props = $props();

  let search = $state("");
  let viewMode = $state<"grid" | "list">("grid");
  let activeLabel = $state("");
  let newFolderOpen = $state(false);
  let uploadOpen = $state(false);
  let renameTarget = $state<DriveItem | null>(null);
  let folderNameDraft = $state("");
  let renameDraft = $state("");
  let droppedFiles = $state<File[]>([]);

  $effect.pre(() => {
    if (!activeLabel && initialLabel) activeLabel = initialLabel;
  });

  const availableLabels = ["Design", "Q4", "Release", "Marketing", "Compliance", "Uploaded"];

  const filteredItems = $derived.by(() => {
    const q = search.trim().toLowerCase();
    return driveStore.items.filter((item) => {
      if (filterMode === "trash") {
        if (!item.trashed) return false;
      } else if (filterMode === "spam") {
        if (!item.spam || item.trashed) return false;
      } else {
        if (item.trashed || item.spam) return false;
        if (filterMode === "favorites" && !item.starred) return false;
        if (filterMode === "shared" && !item.shared) return false;
        if (filterMode === "label" && activeLabel && !item.labels.includes(activeLabel)) return false;
        if (filterMode === "folder" && item.parentId !== driveStore.currentFolderId) return false;
      }
      if (q && !item.name.toLowerCase().includes(q) && !item.owner.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  });

  const currentFolder = $derived(
    driveStore.currentFolderId
      ? driveStore.items.find((i) => i.id === driveStore.currentFolderId) ?? null
      : null,
  );

  const previewImages = $derived(
    filteredItems
      .filter((i) => Boolean(i.previewSrc))
      .map((i) => ({
        src: i.previewSrc!,
        width: 960,
        height: 640,
        alt: i.name,
        caption: `${i.name} · ${i.sizeLabel}`,
      })),
  );

  function submitFolder(event: SubmitEvent) {
    event.preventDefault();
    const created = driveStore.createFolder(folderNameDraft);
    if (!created) return;
    folderNameDraft = "";
    newFolderOpen = false;
    toast.success(`Created folder "${created.name}"`);
  }

  function submitRename(event: SubmitEvent) {
    event.preventDefault();
    if (!renameTarget) return;
    driveStore.renameItem(renameTarget.id, renameDraft);
    toast.success(`Renamed item to "${renameDraft.trim()}"`);
    renameTarget = null;
  }

  function handleItemOpen(item: DriveItem) {
    if (item.kind === "folder") {
      driveStore.openFolder(item.id);
      if (filterMode !== "folder") {
        void goto("/apps/drive/folder");
      }
    } else {
      toast.info(`Selected ${item.name} (${item.sizeLabel})`);
    }
  }
</script>

<CoimStack spacing={4}>
  <div class="flex flex-wrap items-end justify-between gap-3">
    <div class="min-w-64 flex-1">
      <CoimTextField label="Search Drive" placeholder="Filter files and folders..." bind:value={search} fullWidth />
    </div>

    <div class="flex flex-wrap items-center gap-2">
      {#if filterMode !== "trash" && filterMode !== "spam"}
        <CoimButton variant="contained" size="small" onclick={() => (newFolderOpen = true)}>
          {#snippet startIcon()}
            <CiFolderPlus size={16} />
          {/snippet}
          New Folder
        </CoimButton>
        <CoimButton variant="outlined" size="small" onclick={() => (uploadOpen = true)}>
          Upload Files
        </CoimButton>
      {/if}
      <CoimButton
        variant={viewMode === "grid" ? "pastel" : "outlined"}
        size="small"
        onclick={() => (viewMode = "grid")}
      >
        Grid
      </CoimButton>
      <CoimButton
        variant={viewMode === "list" ? "pastel" : "outlined"}
        size="small"
        onclick={() => (viewMode = "list")}
      >
        List
      </CoimButton>
    </div>
  </div>

  {#if filterMode === "folder" && currentFolder}
    <div class="flex items-center gap-2 text-sm">
      <CoimButton size="tiny" variant="outlined" onclick={() => driveStore.openFolder(null)}>
        Back to Root
      </CoimButton>
      <span class="font-medium">/ {currentFolder.name}</span>
    </div>
  {/if}

  {#if filterMode === "label"}
    <div class="flex flex-wrap gap-2">
      <CoimButton
        size="tiny"
        variant={activeLabel === "" ? "contained" : "outlined"}
        onclick={() => (activeLabel = "")}
      >
        All Labels
      </CoimButton>
      {#each availableLabels as lbl (lbl)}
        <CoimButton
          size="tiny"
          variant={activeLabel === lbl ? "contained" : "outlined"}
          onclick={() => (activeLabel = lbl)}
        >
          {lbl}
        </CoimButton>
      {/each}
    </div>
  {/if}

  {#if filteredItems.length === 0}
    <CoimPaper variant="outlined" class="p-8 text-center">
      <p class="font-semibold">No matching items in this Drive view</p>
      <p class="text-text-secondary mt-1 text-sm">Create a folder, upload files, or clear search filters.</p>
    </CoimPaper>
  {:else if viewMode === "grid"}
    <CoimGrid container spacing={3}>
      {#each filteredItems as item (item.id)}
        <CoimGrid size={{ xs: 12, sm: 6, lg: 4 }}>
          <CoimCard class="flex h-full flex-col justify-between">
            <div>
              <CoimCardHeader title={item.name} subheader={`${item.owner} · ${item.updatedAt}`}>
                {#snippet avatar()}
                  <span class="bg-primary/10 text-primary inline-flex h-9 w-9 items-center justify-center rounded-lg">
                    {#if item.kind === "folder"}
                      <CiFolder size={18} />
                    {:else if item.kind === "image"}
                      <CiDocumentImage size={18} />
                    {:else if item.kind === "video"}
                      <CiDocumentVideo size={18} />
                    {:else}
                      <CiDocumentFull size={18} />
                    {/if}
                  </span>
                {/snippet}
                {#snippet action()}
                  <CoimChip label={item.sizeLabel} size="small" variant="outlined" />
                {/snippet}
              </CoimCardHeader>
              <CoimCardContent>
                <div class="flex flex-wrap gap-1">
                  {#if item.starred}
                    <CoimChip label="Favorite" size="small" color="warning" variant="pastel" />
                  {/if}
                  {#if item.shared}
                    <CoimChip label="Shared" size="small" color="info" variant="pastel" />
                  {/if}
                  {#each item.labels as lbl (lbl)}
                    <CoimChip label={lbl} size="small" variant="outlined" />
                  {/each}
                </div>
              </CoimCardContent>
            </div>
            <CoimCardActions>
              {#if filterMode === "trash" || filterMode === "spam"}
                <CoimButton size="tiny" variant="contained" onclick={() => {
                  driveStore.restoreItem(item.id);
                  toast.success(`Restored "${item.name}"`);
                }}>
                  {#snippet startIcon()}
                    <CiRefresh size={14} />
                  {/snippet}
                  Restore
                </CoimButton>
                <CoimButton size="tiny" variant="text" color="error" onclick={() => {
                  driveStore.deletePermanently(item.id);
                  toast.info(`Permanently deleted "${item.name}"`);
                }}>
                  Delete Forever
                </CoimButton>
              {:else}
                <CoimButton size="tiny" variant="outlined" onclick={() => handleItemOpen(item)}>
                  {item.kind === "folder" ? "Open" : "Inspect"}
                </CoimButton>
                <CoimButton size="tiny" variant="text" onclick={() => driveStore.toggleStar(item.id)}>
                  {#snippet startIcon()}
                    <CiStar size={14} />
                  {/snippet}
                  {item.starred ? "Unstar" : "Star"}
                </CoimButton>
                <CoimButton size="tiny" variant="text" onclick={() => driveStore.toggleShare(item.id)}>
                  {#snippet startIcon()}
                    <CiShare size={14} />
                  {/snippet}
                  {item.shared ? "Unshare" : "Share"}
                </CoimButton>
                <CoimButton size="tiny" variant="text" onclick={() => {
                  renameTarget = item;
                  renameDraft = item.name;
                }}>
                  Rename
                </CoimButton>
                <CoimButton size="tiny" variant="text" color="error" onclick={() => {
                  driveStore.moveToTrash(item.id);
                  toast.info(`Moved "${item.name}" to Trash`);
                }}>
                  {#snippet startIcon()}
                    <CiBinEmpty size={14} />
                  {/snippet}
                  Trash
                </CoimButton>
              {/if}
            </CoimCardActions>
          </CoimCard>
        </CoimGrid>
      {/each}
    </CoimGrid>
  {:else}
    <CoimCard>
      <CoimCardContent>
        <CoimTableContainer>
          <CoimTable aria-label="Cloud Drive files">
            <CoimTableHead>
              <CoimTableRow>
                <CoimTableCell component="th">Name</CoimTableCell>
                <CoimTableCell component="th">Kind</CoimTableCell>
                <CoimTableCell component="th">Owner</CoimTableCell>
                <CoimTableCell component="th">Size</CoimTableCell>
                <CoimTableCell component="th">Modified</CoimTableCell>
                <CoimTableCell component="th" align="right">Actions</CoimTableCell>
              </CoimTableRow>
            </CoimTableHead>
            <CoimTableBody>
              {#each filteredItems as item (item.id)}
                <CoimTableRow>
                  <CoimTableCell>
                    <button type="button" class="hover:text-primary font-medium" onclick={() => handleItemOpen(item)}>
                      {item.name}
                    </button>
                  </CoimTableCell>
                  <CoimTableCell>{item.kind}</CoimTableCell>
                  <CoimTableCell>{item.owner}</CoimTableCell>
                  <CoimTableCell>{item.sizeLabel}</CoimTableCell>
                  <CoimTableCell>{item.updatedAt}</CoimTableCell>
                  <CoimTableCell align="right">
                    {#if filterMode === "trash" || filterMode === "spam"}
                      <CoimButton size="tiny" variant="outlined" onclick={() => driveStore.restoreItem(item.id)}>
                        Restore
                      </CoimButton>
                    {:else}
                      <CoimButton size="tiny" variant="text" color="error" onclick={() => driveStore.moveToTrash(item.id)}>
                        Trash
                      </CoimButton>
                    {/if}
                  </CoimTableCell>
                </CoimTableRow>
              {/each}
            </CoimTableBody>
          </CoimTable>
        </CoimTableContainer>
      </CoimCardContent>
    </CoimCard>
  {/if}

  {#if previewImages.length > 0 && filterMode !== "trash" && filterMode !== "spam"}
    <CoimCard>
      <CoimCardHeader title="Image Preview Gallery" subheader="Open media files in Lightbox" />
      <CoimCardContent>
        <CoimLightbox images={previewImages} showCounter showCaptions />
      </CoimCardContent>
    </CoimCard>
  {/if}
</CoimStack>

<CoimDialog bind:open={newFolderOpen} maxWidth="xs" fullWidth>
  <form onsubmit={submitFolder}>
    <CoimDialogTitle>Create Folder</CoimDialogTitle>
    <CoimDialogContent>
      <CoimTextField label="Folder Name" placeholder="e.g. Brand Assets" bind:value={folderNameDraft} required fullWidth />
    </CoimDialogContent>
    <CoimDialogActions>
      <CoimButton type="button" variant="text" onclick={() => (newFolderOpen = false)}>Cancel</CoimButton>
      <CoimButton type="submit" variant="contained">Create</CoimButton>
    </CoimDialogActions>
  </form>
</CoimDialog>

<CoimDialog open={Boolean(renameTarget)} onClose={() => (renameTarget = null)} maxWidth="xs" fullWidth>
  <form onsubmit={submitRename}>
    <CoimDialogTitle>Rename Item</CoimDialogTitle>
    <CoimDialogContent>
      <CoimTextField label="Item Name" bind:value={renameDraft} required fullWidth />
    </CoimDialogContent>
    <CoimDialogActions>
      <CoimButton type="button" variant="text" onclick={() => (renameTarget = null)}>Cancel</CoimButton>
      <CoimButton type="submit" variant="contained">Save Name</CoimButton>
    </CoimDialogActions>
  </form>
</CoimDialog>

<CoimDialog bind:open={uploadOpen} maxWidth="sm" fullWidth>
  <CoimDialogTitle>Upload Files to Drive</CoimDialogTitle>
  <CoimDialogContent>
    <CoimDropzone
      bind:files={droppedFiles}
      onDrop={(accepted) => {
        if (accepted.length > 0) {
          driveStore.uploadFiles(accepted);
          uploadOpen = false;
          toast.success(`Uploaded ${accepted.length} file(s) to Drive`);
        }
      }}
    />
  </CoimDialogContent>
  <CoimDialogActions>
    <CoimButton type="button" variant="text" onclick={() => (uploadOpen = false)}>Close</CoimButton>
  </CoimDialogActions>
</CoimDialog>
