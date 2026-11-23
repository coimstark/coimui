<script lang="ts">
  import DriveBrowserView from "#lib/apps/DriveBrowserView.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Favorites</title>
</svelte:head>

<DriveShell title="Starred Favorites" subtitle="Quick-access pinned files and folders across workspaces.">
  <DriveBrowserView filterMode="favorites" />
</DriveShell>
