<script lang="ts">
  import DriveBrowserView from "#lib/apps/DriveBrowserView.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Spam</title>
</svelte:head>

<DriveShell title="Flagged &amp; Quarantined Items" subtitle="Inspect suspicious external shares, restore safe items, or purge permanently.">
  <DriveBrowserView filterMode="spam" />
</DriveShell>
