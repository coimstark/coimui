<script lang="ts">
  import DriveBrowserView from "#lib/apps/DriveBrowserView.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Files</title>
</svelte:head>

<DriveShell title="All Files" subtitle="Browse, rename, star, upload, preview, or organize active workspace files.">
  <DriveBrowserView filterMode="all" />
</DriveShell>
