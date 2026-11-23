<script lang="ts">
  import AccountSettingsPanel from "#lib/components/AccountSettingsPanel.svelte";
  import AiContentShell from "#lib/apps/AiContentShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Content · Settings</title>
</svelte:head>

<AiContentShell title="AI Content Settings" subtitle="Studio identity, team permissions metadata, and notification settings.">
  <AccountSettingsPanel sectionTitle="AI Content Studio" />
</AiContentShell>
