<script lang="ts">
  import AccountSettingsPanel from "#lib/components/AccountSettingsPanel.svelte";
  import AiChatShell from "#lib/apps/AiChatShell.svelte";
</script>

<svelte:head>
  <title>CoimUI Showcase — AI Chat · Settings</title>
</svelte:head>

<AiChatShell
  title="AI Chat Workspace Settings"
  subtitle="Manage profile details, team department, and direct notification preferences."
>
  <AccountSettingsPanel sectionTitle="AI Chat" />
</AiChatShell>
