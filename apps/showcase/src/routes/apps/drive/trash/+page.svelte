<script lang="ts">
  import DriveBrowserView from "#lib/apps/DriveBrowserView.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Trash</title>
</svelte:head>

<DriveShell title="Trash &amp; Recovery" subtitle="Restore deleted files back to your library or purge them permanently.">
  <DriveBrowserView filterMode="trash" />
</DriveShell>
