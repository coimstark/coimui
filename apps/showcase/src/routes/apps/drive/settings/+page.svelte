<script lang="ts">
  import AccountSettingsPanel from "#lib/components/AccountSettingsPanel.svelte";
  import DriveShell from "#lib/apps/DriveShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — Cloud Drive · Settings</title>
</svelte:head>

<DriveShell title="Cloud Drive Settings" subtitle="Profile, organization quota preferences, and sharing notifications.">
  <AccountSettingsPanel sectionTitle="Cloud Drive" />
</DriveShell>
