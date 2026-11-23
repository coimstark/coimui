<script lang="ts">
  import DriveBrowserView from "#lib/apps/DriveBrowserView.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Folder</title>
</svelte:head>

<DriveShell title="Folder Explorer" subtitle="Hierarchical folder navigation with breadcrumbs and nested item uploads.">
  <DriveBrowserView filterMode="folder" />
</DriveShell>
