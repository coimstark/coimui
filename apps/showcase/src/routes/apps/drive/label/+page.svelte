<script lang="ts">
  import DriveBrowserView from "#lib/apps/DriveBrowserView.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Labels</title>
</svelte:head>

<DriveShell title="Labeled Files" subtitle="Filter files and folders by workspace category tags.">
  <DriveBrowserView filterMode="label" />
</DriveShell>
