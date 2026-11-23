<script lang="ts">
  import DriveBrowserView from "#lib/apps/DriveBrowserView.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive</title>
</svelte:head>

<DriveShell
  title="Cloud Drive"
  subtitle="Manage folders, shared documents, labels, workspaces, storage usage, and recovery views."
>
  <DriveBrowserView filterMode="all" />
</DriveShell>
