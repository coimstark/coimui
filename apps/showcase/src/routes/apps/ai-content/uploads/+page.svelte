<script lang="ts">
  import {
    CoimButton,
    CoimCard,
    CoimCardContent,
    CoimCardHeader,
    CoimDropzone,
    CoimList,
    CoimListItem,
    CoimListItemText,
    CoimStack,
    toast,
  } from "@coimui/svelte";
  import { aiContentStore } from "#lib/apps/ai-content.svelte.ts";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";

  let droppedFiles = $state<File[]>([]);
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Uploads</title>
</svelte:head>

<AiContentShell
  title="Reference Uploads"
  subtitle="Upload local reference plates and source assets for conditioning configured pipelines."
>
  <CoimStack spacing={4}>
    <CoimCard>
      <CoimCardHeader title="Upload Source Media" subheader="PNG, JPG, WebP, or MP4 reference clips" />
      <CoimCardContent>
        <CoimDropzone
          bind:files={droppedFiles}
          title="Drop reference plates here or click to browse"
          subtitle="Files are staged locally in browser memory"
          onDrop={(accepted) => {
            if (accepted.length > 0) {
              aiContentStore.addUploadFiles(accepted);
              toast.success(`Staged ${accepted.length} reference file(s)`);
            }
          }}
        />
      </CoimCardContent>
    </CoimCard>

    <CoimCard>
      <CoimCardHeader title="Staged Reference Assets" subheader={`${aiContentStore.uploads.length} items ready`} />
      <CoimCardContent>
        <CoimList>
          {#each aiContentStore.uploads as up (up.id)}
            <CoimListItem>
              <CoimListItemText
                primary={up.name}
                secondary={`${Math.max(1, Math.round(up.size / 1024))} KB · Uploaded ${up.uploadedAt}`}
              />
              <CoimButton
                size="tiny"
                variant="text"
                color="error"
                onclick={() => {
                  aiContentStore.removeUpload(up.id);
                  toast.info(`Removed ${up.name}`);
                }}
              >
                Remove
              </CoimButton>
            </CoimListItem>
          {/each}
        </CoimList>
      </CoimCardContent>
    </CoimCard>
  </CoimStack>
</AiContentShell>
