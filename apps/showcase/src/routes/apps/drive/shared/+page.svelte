<script lang="ts">
  import DriveBrowserView from "#lib/apps/DriveBrowserView.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Shared</title>
</svelte:head>

<DriveShell title="Shared With Team" subtitle="Manage collaborative access and external sharing permissions.">
  <DriveBrowserView filterMode="shared" />
</DriveShell>
